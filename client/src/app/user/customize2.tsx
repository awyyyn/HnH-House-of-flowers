import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RichTextEditor,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components";
import {
  ADD_CUSTOMIZE_BOUQUET_TO_CART_MUTATOIN,
  CREATE_CUSTOMOMIZE_ORDER_MUTATION,
  GET_PRODUCT_QUERY,
  READ_COMPONENTS_QUERY,
} from "@/queries";
import { componentsAtom } from "@/states/components";
import { Component, Product } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useSetAtom } from "jotai";
import { Info, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { ComponentDetailsModal } from "../admin/components/component-modal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts";
import { cartAtom } from "@/states";

const formSchema = z
  .object({
    flower: z.string({
      message: "You must pick your preferred flower",
    }),
    wrapper: z.string({
      message: "You must pick your preferred wrapper",
    }),
    wrapperColor: z.string().optional(),
    note: z.string().optional(),
    totalPrice: z.number(),
    bill: z.number().optional(),
    billQuantity: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!!data.bill && !data.billQuantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "If you select a bill, you must also specify the quantity",
        path: ["billQuantity"],
      });
    }
    if (data.billQuantity) {
      if (isNaN(parseInt(data.billQuantity))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity must be a valid number",
          path: ["billQuantity"],
        });
      }

      if (Number(data.billQuantity) < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum quantity is 5",
          path: ["billQuantity"],
        });
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

const Customize2 = () => {
  const { productId } = useParams();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [component, setComponent] = useState<Component | null>(null);
  const { toast } = useToast();
  const setCart = useSetAtom(cartAtom);
  const [createOrder, { loading: creatingOrder }] = useMutation(
    CREATE_CUSTOMOMIZE_ORDER_MUTATION,
  );
  const [addToCart, { loading: addingToCart }] = useMutation(
    ADD_CUSTOMIZE_BOUQUET_TO_CART_MUTATOIN,
  );
  const [componentsState, setComponentsState] = useAtom(componentsAtom);
  const { data, loading } = useQuery<{ product: Product }>(GET_PRODUCT_QUERY, {
    variables: {
      id: productId,
    },
    onCompleted(data) {
      form.setValue("flower", data.product.components[0].id);
      form.setValue("wrapper", data.product.components[1].id);
      form.setValue("totalPrice", data.product.price || 0);
    },
  });

  useQuery<{
    components: { data: Component[]; hasNextPage: boolean; total: number };
  }>(READ_COMPONENTS_QUERY, {
    variables: {
      isAvailable: true,
    },
    onCompleted(data) {
      setComponentsState(data.components.data || []);
    },
  });

  const flowerOptions =
    componentsState.filter((comp) => comp.type === "FLOWER") || [];
  const wrapperOptions =
    componentsState.filter((comp) => comp.type === "WRAPPER") || [];

  const flowerOldPrice = flowerOptions.find(
    (flower) => flower.id === data?.product?.components[0].id,
  )?.price;
  const wrapperOldPrice = wrapperOptions.find(
    (wrapper) => wrapper.id === data?.product?.components[1].id,
  )?.price;

  // optionsStates

  const watchedFlower = form.watch("flower");
  const watchedWrapper = form.watch("wrapper");
  const watchedBill = form.watch("bill");
  const watchedBillQuantity = form.watch("billQuantity");
  const addedOtherFee = (watchedBill || 0) * Number(watchedBillQuantity || 0);

  useEffect(() => {
    if (watchedBill) {
      form.setValue("billQuantity", "5");
    }
  }, [watchedBill]);

  useEffect(() => {
    if (watchedFlower && watchedWrapper) {
      const flower = flowerOptions.find((flr) => flr.id === watchedFlower);
      const wrapper = wrapperOptions.find((wrp) => wrp.id === watchedWrapper);

      let tot = product.price;
      tot -= wrapperOldPrice || 0;
      tot -= flowerOldPrice || 0;
      tot += flower?.price || 0;
      tot += wrapper?.price || 0;
      if (watchedBill && watchedBillQuantity) {
        tot += Number(watchedBill) * Number(watchedBillQuantity || 0);
      }

      form.setValue("totalPrice", tot || 0);
    }
  }, [watchedFlower, watchedWrapper, watchedBill, watchedBillQuantity]);

  if (loading) return <h1>Loading...</h1>;

  if (!data?.product) {
    return <h1>Product not found!</h1>;
  }

  const product = data.product;

  function handleSetComponent(type: Component["type"]) {
    switch (type) {
      case "FLOWER": {
        const flwr = flowerOptions.find(
          (flr) => flr.id === form.watch("flower"),
        );
        if (flwr) setComponent(flwr);
        break;
      }

      case "WRAPPER": {
        const wrppr = wrapperOptions.find(
          (wrp) => wrp.id === form.watch("wrapper"),
        );
        if (wrppr) setComponent(wrppr);
        break;
      }

      default:
    }
  }

  async function handleSubmit(values: FormData) {
    try {
      if (!isAuthenticated) {
        return navigate("/auth/login", {
          state: {
            from: `/bouquets/${productId}/customize`,
            data: values,
          },
        });
      }

      const order = await createOrder({
        variables: {
          customData: {
            productId: product.id,
            note: values.note || "",
            totalPrice: values.totalPrice,
            components: [values.flower, values.wrapper],
            wrapperColor: values.wrapperColor || "",
            bill: values.bill || 0,
            billQuantity: values.billQuantity || 0,
          },

          // TODO: Add type of delivery
        },
      });
      toast({
        title: "Order Placed!",
        description: "Please wait for the admin to confirm your order",
        variant: "success",
      });

      setTimeout(() => {
        toast({
          title: "Redirecting to payment page",
          description: "Please wait...",
          variant: "success",
        });
      }, 3000);

      setTimeout(() => {
        window.location.replace(
          order.data.createCustomizeOrder.payment.checkoutUrl,
        );
      }, 8000);
    } catch (err) {
      toast({
        title: "Error Occurred!",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  }

  async function handleAddCustomizedOrderToCart() {
    if (!isAuthenticated) {
      return navigate("/auth/login", {
        state: {
          from: `/bouquets/${productId}/customize`,
          data: form.getValues(),
        },
      });
    }
    const values = form.getValues();

    try {
      const { data } = await addToCart({
        variables: {
          quantity: 1,
          price: values.totalPrice,
          productId: product.id,
          cartId: user.cart.id,
          components: [values.flower, values.wrapper],
          note: values.note || "",
          wrapperColor: values.wrapperColor || "",
          bill: values.bill || 0,
          billQuantity: values.billQuantity || 0,
        },
      });

      setCart((p) => {
        return {
          ...p,
          items: [...p.items, data.addCustomizedBouquetToCart],
        };
      });
      toast({
        title: "Success",
        description: "Item added to cart",
        variant: "success",
      });
    } catch (err) {
      console.log(err, "qq");
      toast({
        title: "Error Occurred!",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  }

  const availableColors =
    wrapperOptions.find((wrpr) => wrpr.id === form.watch("wrapper"))
      ?.availableColors || [];

  return (
    <>
      <div className="conatiner mx-auto">
        <div className="grid grid-cols-1 gap-3 lg:gap-5 md:grid-cols-2">
          <div className="space-y-5">
            <h1 className="text-xl   flex gap-1 items-center">
              Product:
              <span className=" font-thin text-2xl">{product.name}</span>
            </h1>
            <div className="">
              <div className="border shadow-md rounded-xl overflow-hidden relative min-w-full min-h-[350px] sm:min-h-[400px sm:h-[400px]   dark:border-transparent dark:bg-zinc-900  sm:max-w-[400px]  sm:min-w-[300px] lg:max-w-[400px] lg:max-h-[400px] lg:h-[400px] xl:max-h-[500px] xl:h-[500px] xl:w-[500px] xl:min-w-[500px] xl:max-w-[500px] mx-auto   ">
                <img
                  className="absolute  inset-0 w-full h-full object-contain"
                  src={product.images[0]}
                />
              </div>
            </div>
            <div className="  ">
              <div className="space-y-3">
                <div className="flex gap-1">
                  <p className="dark:text-white/90">Price:</p>
                  <p className="font-thin capitalize">
                    {Intl.NumberFormat("en-PH", {
                      currency: "PHP",
                      style: "currency",
                    }).format(product.price)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <p className="dark:text-white/90">Category:</p>
                  <p className="font-thin capitalize">
                    {product.category.toLowerCase()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <p className="dark:text-white/90">Status:</p>
                  <p className="font-thin capitalize">
                    {product.stock === 0
                      ? "Out of stock"
                      : product.status.toLowerCase().split("_").join(" ")}{" "}
                    {product.stock > 0 && (
                      <>
                        <span className="ml-1 text-xs">x</span>
                        <span className="text-md text-gray-600">
                          {product.stock}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <p className="dark:text-white/90">Description:</p>
                  <RichTextEditor
                    content={product.description}
                    handleValue={() => {}}
                    isEditing={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-thin">Customize components</h1>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <div className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="wrapper"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col  items-start">
                          <div className="flex items-center w-full  gap-5  ">
                            <div className="w-[70%] md:w-[85%]">
                              <FormLabel className="text-black dark:text-white ">
                                Wrapper Component
                              </FormLabel>

                              <Select
                                onValueChange={field.onChange}
                                // value={field.value}
                                // defaultValue={form.getValues("wrapper")}
                                {...field}
                              >
                                <SelectTrigger className="w-full border-gray-300 dark:bg-zinc-900">
                                  <SelectValue placeholder="Select a flower" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Wrappers</SelectLabel>
                                    {wrapperOptions.length > 0 ? (
                                      wrapperOptions.map((wrapper) => (
                                        <SelectItem
                                          value={wrapper.id}
                                          key={wrapper.id}
                                          className="capitalize  w-full  "
                                        >
                                          <div className="   flex  items-center gap-3">
                                            <img
                                              src={
                                                wrapper.image ||
                                                "https://blocks.astratic.com/img/general-img-landscape.png"
                                              }
                                              alt={wrapper.name}
                                              className="w-6 h-6 rounded-full mr-2 shadow-sm border"
                                            />

                                            <p className=" ">{wrapper.name}</p>
                                          </div>
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem
                                        key="no-available"
                                        value="no-available"
                                      >
                                        No available wrappers
                                      </SelectItem>
                                    )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="">
                              <h3>Price:</h3>
                              <p>
                                {Intl.NumberFormat("en-PH", {
                                  currency: "PHP",
                                  style: "currency",
                                }).format(
                                  wrapperOptions.find(
                                    (wrapper) =>
                                      wrapper.id === form.watch("wrapper"),
                                  )?.price || 0,
                                )}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={creatingOrder || addingToCart}
                              className="self-end mb-1"
                              onClick={() => handleSetComponent("WRAPPER")}
                            >
                              <Info />
                            </Button>
                          </div>
                          <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="wrapperColor"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel className="text-black  dark:text-white ">
                            Available Wrapper Colors
                          </FormLabel>
                          <ToggleGroup
                            disabled={creatingOrder || addingToCart}
                            className=""
                            value={field.value}
                            onValueChange={field.onChange}
                            type="single"
                          >
                            {availableColors.length > 0 ? (
                              availableColors.map((color, index) => (
                                <ToggleGroupItem
                                  key={`color-${index}`}
                                  value={color}
                                >
                                  {color}
                                </ToggleGroupItem>
                              ))
                            ) : (
                              <ToggleGroupItem disabled value="NAC">
                                No Available Color
                              </ToggleGroupItem>
                            )}
                          </ToggleGroup>
                          <FormMessage className="dark:text-primary" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="flower"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col  items-start">
                          <div className="flex items-center w-full  gap-5  ">
                            <div className="w-[70%] md:w-[85%]">
                              <FormLabel className="text-black dark:text-white ">
                                Flower Component
                              </FormLabel>

                              <Select
                                disabled={creatingOrder || addingToCart}
                                onValueChange={field.onChange}
                                {...field}
                              >
                                <SelectTrigger className="w-full border-gray-300 dark:bg-zinc-900">
                                  <SelectValue placeholder="Select a flower" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Fllowers</SelectLabel>
                                    {flowerOptions.map((flower) => (
                                      <SelectItem
                                        value={flower.id}
                                        key={flower.id}
                                        className="capitalize  w-full  "
                                      >
                                        <div className="   flex  items-center gap-3">
                                          <img
                                            src={
                                              flower.image ||
                                              "https://blocks.astratic.com/img/general-img-landscape.png"
                                            }
                                            alt={flower.name}
                                            className="w-6 h-6 rounded-full mr-2 shadow-sm border"
                                          />

                                          <p className=" ">{flower.name}</p>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="">
                              <h3>Price:</h3>
                              <p>
                                {Intl.NumberFormat("en-PH", {
                                  currency: "PHP",
                                  style: "currency",
                                }).format(
                                  flowerOptions.find(
                                    (flower) =>
                                      flower.id === form.getValues().flower,
                                  )?.price || 0,
                                )}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="self-end mb-1"
                              onClick={() => handleSetComponent("FLOWER")}
                            >
                              <Info />
                            </Button>
                          </div>
                          <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                        </FormItem>
                      )}
                    />
                    <div className=" ">
                      <div className="col-span-4">
                        <h1 className="text-black dark:text-white ">
                          Money Bouquey
                        </h1>
                      </div>
                      <div className="flex w-full  gap-5    items-start">
                        <div className="  w-[70%] md:w-[85%]   ">
                          <div className="grid grid-cols-3 gap-5 mr-4">
                            <FormField
                              control={form.control}
                              name="bill"
                              render={({ field }) => (
                                <FormItem className="  col-span-2 w-full   t">
                                  <FormLabel className="text-sm">
                                    Bill
                                  </FormLabel>
                                  <Select
                                    disabled={creatingOrder || addingToCart}
                                    onValueChange={(v) => {
                                      field.onChange(parseInt(v));
                                      return v;
                                    }}
                                    {...field}
                                    value={field.value?.toString() || ""}
                                  >
                                    <SelectTrigger className="w-full border-gray-300 dark:bg-zinc-900">
                                      <SelectValue placeholder="Select a flower" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Bill</SelectLabel>
                                        {[50, 100, 200, 500, 1000].map(
                                          (bill) => (
                                            <SelectItem
                                              value={bill.toString()}
                                              key={bill}
                                              className="capitalize  w-full  "
                                            >
                                              {Intl.NumberFormat("en-PH", {
                                                currency: "PHP",
                                                style: "currency",
                                              }).format(bill)}{" "}
                                              Bill
                                            </SelectItem>
                                          ),
                                        )}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>

                                  <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                                </FormItem>
                              )}
                            />
                            {!!watchedBill && (
                              <FormField
                                control={form.control}
                                name="billQuantity"
                                render={({ field }) => (
                                  <FormItem className=" ">
                                    <FormLabel className="text-sm">
                                      Quantity
                                    </FormLabel>
                                    <Input
                                      type="text"
                                      {...field}
                                      value={field.value?.toString() || ""}
                                      onInput={(e) => {
                                        // ✅ Allow deleting all digits
                                        e.currentTarget.value =
                                          e.currentTarget.value.replace(
                                            /\D/g,
                                            "",
                                          );
                                      }}
                                    />
                                    <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </div>
                        <div className="">
                          <h3>Price:</h3>
                          <p>
                            {Intl.NumberFormat("en-PH", {
                              currency: "PHP",
                              style: "currency",
                            }).format(
                              (watchedBill || 0) *
                                (Number(watchedBillQuantity) || 0),
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="note"
                      render={() => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel className="text-black dark:text-white ">
                            Note
                          </FormLabel>
                          <FormControl className="w-full">
                            <RichTextEditor
                              isEditing={!creatingOrder || addingToCart}
                              handleValue={(editor) => {
                                form.setValue(
                                  "note",
                                  JSON.stringify(editor.getJSON()),
                                );
                              }}
                              content={form.formState.defaultValues?.note ?? ""}
                              editable={!creatingOrder || addingToCart}
                            />
                          </FormControl>
                          <FormMessage className="dark:text-primary" />
                        </FormItem>
                      )}
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="">Wrapper Fee:</h3>
                        <span className="text-lg font-thin">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(
                            wrapperOptions.find(
                              (wrp) => wrp.id === form.watch("wrapper"),
                            )?.price || 0,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="">Flower Fee:</h3>
                        <span className="text-lg font-thin">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(
                            flowerOptions.find(
                              (f) => f.id === form.watch("flower"),
                            )?.price || 0,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="">Service Fee:</h3>
                        <span className="text-lg font-thin">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(product.serviceFee || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="">Other Fee:</h3>
                        <span className="text-lg font-thin">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(product.otherFee || 0 + addedOtherFee)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl">Total Customization Price: </h3>
                        <span className="text-xl font-medium">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(form.watch("totalPrice") || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full justify-end flex gap-2 items-center mt-4">
                    <Button
                      className="min-w-[100px]"
                      variant="outline"
                      type="button"
                      onClick={handleAddCustomizedOrderToCart}
                      disabled={creatingOrder || addingToCart}
                    >
                      {addingToCart ? (
                        <Loader className="animate-spin" />
                      ) : (
                        <span className="text-sm">Add To Cart</span>
                      )}
                    </Button>
                    <Button
                      className="min-w-[100px]"
                      disabled={creatingOrder || addingToCart}
                    >
                      {creatingOrder ? (
                        <Loader className="animate-spin" />
                      ) : (
                        <span className="text-sm">Place Order</span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      {component && (
        <>
          <ComponentDetailsModal
            isOpen={!!component}
            component={component}
            handleClose={() => setComponent(null)}
          />
        </>
      )}
    </>
  );
};

export default Customize2;
