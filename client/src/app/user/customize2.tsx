import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
  GET_CUSTOMIZE_OPTIONS_QUERY,
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
    flowers: z.array(z.string()).min(1, "You must pick at least one flower"),
    wrapper: z.string({
      message: "You must pick your preferred wrapper",
    }),
    wrapperColor: z.string().optional(),
    note: z.string().optional(),
    totalPrice: z.number(),
    bill: z.number().optional(),
    billQuantity: z.string().optional(),
    otherProducts: z.array(z.string()).optional(),
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
  const [flwrsNum, setFlwrsNum] = useState<number>(1);
  const [additionalProducts, setAdditionalProducts] = useState<number>(1);
  const [componentsState, setComponentsState] = useAtom(componentsAtom);
  const [additionalProductsOptions, setAdditionalProductsOptions] = useState<
    Product[]
  >([]);
  const { data, loading } = useQuery<{
    components: { data: Component[]; hasNextPage: boolean; total: number };
    product: Product;
    gifts: { data: Product[]; hasNextPage: boolean; total: number };
    chocolates: { data: Product[]; hasNextPage: boolean; total: number };
  }>(GET_CUSTOMIZE_OPTIONS_QUERY, {
    variables: {
      id: productId,
      isAvailable: true,
      giftsCategory: "GIFT",
      chocolatesCategory: "CHOCOLATE",
    },
    onCompleted(data) {
      setComponentsState(data.components.data || []);
      form.setValue(
        "flowers",
        (data.product.flowerComponents || [])?.map((flwr) => flwr.id),
      );
      setFlwrsNum(data.product.flowerComponents?.length || 1);
      form.setValue("wrapper", data.product.wrapperComponent?.id || "");
      form.setValue("totalPrice", data.product.price || 0);
      setAdditionalProductsOptions(
        [...(data.chocolates.data || []), ...(data.gifts.data || [])].filter(
          (item) => item.stock > 1 && item.status === "IN_STOCK",
        ),
      );
    },
  });
  const [totalPrice, setTotalPrice] = useState<number>(
    data?.product.price || 0,
  );
  const [additionalPrdctsFees, setAdditionalPrdctsFees] = useState<number>(0);
  const [flowerFees, setFlowerFees] = useState<number>(0);

  const flowerOptions =
    componentsState.filter((comp) => comp.type === "FLOWER") || [];
  const wrapperOptions =
    componentsState.filter((comp) => comp.type === "WRAPPER") || [];

  // const flowerOldPrice = flowerOptions.find(
  //   (flower) => flower.id === data?.product?.components[0].id,
  // )?.price;
  // const wrapperOldPrice = wrapperOptions.find(
  //   (wrapper) => wrapper.id === data?.product?.components[1].id,
  // )?.price;

  // optionsStates

  useEffect(() => {
    let total = 0;
    const addtprdcts = form.watch("otherProducts");
    const totalProducts = (addtprdcts || []).reduce((acc, prdctId) => {
      const product = additionalProductsOptions.find((p) => p.id === prdctId);
      return acc + (product?.price || 0);
    }, 0);

    const flowers = form.watch("flowers");

    const totalFlowers = (flowers || []).reduce((acc, flwrId) => {
      const flower = flowerOptions.find((f) => f.id === flwrId);
      return acc + (flower?.price || 0);
    }, 0);

    const wrapper =
      wrapperOptions.find((wrapper) => wrapper.id === form.getValues("wrapper"))
        ?.price || 0;

    total += totalFlowers;
    total += totalProducts;
    total += wrapper;
    total += data?.product.serviceFee || 0;
    total += data?.product.otherFee || 0;

    setFlowerFees(totalFlowers);
    setAdditionalPrdctsFees(totalProducts);
    form.setValue("totalPrice", total);
  }, [additionalProducts, data, totalPrice, flwrsNum]);

  if (loading) return <h1>Loading...</h1>;

  if (!data?.product) {
    return <h1>Product not found!</h1>;
  }

  const product = data.product;

  function handleSetComponent(type: Component["type"]) {
    switch (type) {
      case "FLOWER": {
        // const flwr = flowerOptions.find(
        //   (flr) => flr.id === form.watch("flower"),
        // );
        // if (flwr) setComponent(flwr);
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
      // return console.log(values, "qqqq");
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
            // components: [values.flower, values.wrapper],
            wrapperColor: values.wrapperColor || "",
            flowerComponents: values.flowers || [],
            wrapperComponent: values.wrapper || "",
            otherProducts: values.otherProducts || [],
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
          flowerComponents: values.flowers,
          wrapperComponent: values.wrapper,
          otherProducts: values.otherProducts,
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
      <div className="conatiner mx-auto pb-10">
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
                                defaultValue={
                                  product.wrapperComponent?.id || ""
                                }
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
                      name="flowers"
                      render={() => (
                        <FormItem className="flex w-full flex-col  items-start">
                          <div className="flex items-center w-full  gap-5  ">
                            <div className="w-[70%] md:w-[85%]">
                              <FormLabel className="text-black dark:text-white ">
                                Flower Components
                              </FormLabel>
                            </div>
                          </div>

                          {(product?.flowerComponents || [])?.length > 0 &&
                            Array.from({ length: flwrsNum }).map(
                              (_, index: number) => (
                                <div key={index} className="w-full">
                                  <div className="flex items-center w-full  gap-5  ">
                                    <div className="w-[70%] md:w-[85%]">
                                      <Select
                                        defaultValue={
                                          product?.flowerComponents?.[index]
                                            ?.id || ""
                                        }
                                        key={index}
                                        // onValueChange={field.onChange}
                                        onValueChange={(value) => {
                                          console.log(value);
                                          const flwrs =
                                            form.getValues("flowers") || [];
                                          flwrs[index] = value;
                                          form.setValue("flowers", flwrs);
                                          setTotalPrice((p) => p + 1);
                                        }}
                                      >
                                        <SelectTrigger className="w-full  mt-1 border-gray-300 dark:bg-zinc-900">
                                          <SelectValue placeholder="Select a flower" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectLabel>
                                              Flower {index + 1}
                                            </SelectLabel>
                                            {flowerOptions.length > 0 ? (
                                              flowerOptions.map((flower) => (
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

                                                    <p className=" ">
                                                      {flower.name}
                                                    </p>
                                                  </div>
                                                </SelectItem>
                                              ))
                                            ) : (
                                              <SelectItem
                                                value="no-data"
                                                key="no-data"
                                                disabled
                                              >
                                                No flower components available
                                              </SelectItem>
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex gap-2 items-end justify-start">
                                      <div>
                                        <h3>Price:</h3>
                                        <p>
                                          {Intl.NumberFormat("en-PH", {
                                            currency: "PHP",
                                            style: "currency",
                                          }).format(
                                            flowerOptions.find(
                                              (flower) =>
                                                flower.id ===
                                                (form.getValues()?.flowers ||
                                                  [])![index],
                                            )?.price || 0,
                                          )}
                                        </p>
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          const flwrs =
                                            form.getValues("flowers") || [];

                                          if (flwrs.length >= index) {
                                            flwrs.splice(index, 1);
                                            form.setValue("flowers", flwrs);
                                          }
                                          console.log(flwrs, "qq");
                                          setFlwrsNum((num) => num - 1);
                                        }}
                                        type="button"
                                        disabled={
                                          form.getValues("flowers")?.length ===
                                          1
                                        }
                                        className="mt-0.5"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}

                          <Button
                            onClick={() => setFlwrsNum((num) => num + 1)}
                            size="sm"
                            className="mt-1"
                            type="button"
                          >
                            Add Flower
                          </Button>

                          <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="otherProducts"
                      render={() => (
                        <FormItem className="flex w-full flex-col  items-start">
                          <div className="flex items-center w-full  gap-5  ">
                            <div className="w-[70%] md:w-[85%]">
                              <FormLabel className="text-black dark:text-white ">
                                Additional Products
                              </FormLabel>
                            </div>
                          </div>

                          {Array.from({ length: additionalProducts }).map(
                            (_, index: number) => (
                              <div key={index} className="w-full">
                                <div className="flex items-center w-full  gap-5  ">
                                  <div className="w-[70%] md:w-[85%]">
                                    <Select
                                      key={index}
                                      // onValueChange={field.onChange}
                                      onValueChange={(value) => {
                                        console.log(value);
                                        const prdcts =
                                          form.getValues("otherProducts") || [];
                                        prdcts[index] = value;
                                        form.setValue("otherProducts", prdcts);
                                        setTotalPrice((p) => p + 1);
                                      }}
                                    >
                                      <SelectTrigger className="w-full  mt-1 border-gray-300 dark:bg-zinc-900">
                                        <SelectValue placeholder="Select a product" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>
                                            Product {index + 1}
                                          </SelectLabel>
                                          {additionalProductsOptions.length >
                                          0 ? (
                                            additionalProductsOptions.map(
                                              (product) => (
                                                <SelectItem
                                                  value={product.id}
                                                  key={product.id}
                                                  className="capitalize  w-full  "
                                                >
                                                  <div className="   flex  items-center gap-3">
                                                    <img
                                                      src={
                                                        product.images[0] ||
                                                        "https://blocks.astratic.com/img/general-img-landscape.png"
                                                      }
                                                      alt={product.name}
                                                      className="w-6 h-6 rounded-full mr-2 shadow-sm border"
                                                    />

                                                    <p className=" ">
                                                      {product.name}
                                                    </p>
                                                  </div>
                                                </SelectItem>
                                              ),
                                            )
                                          ) : (
                                            <SelectItem
                                              value="no-data"
                                              key="no-data"
                                              disabled
                                            >
                                              No products available
                                            </SelectItem>
                                          )}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex gap-2 items-end justify-start">
                                    <div className="">
                                      <h3>Price:</h3>
                                      <p>
                                        {Intl.NumberFormat("en-PH", {
                                          currency: "PHP",
                                          style: "currency",
                                        }).format(
                                          additionalProductsOptions.find(
                                            (product) =>
                                              product.id ===
                                              (form.getValues()
                                                ?.otherProducts || [])![index],
                                          )?.price || 0,
                                        )}
                                      </p>
                                    </div>{" "}
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const flwrs =
                                          form.getValues("otherProducts") || [];
                                        flwrs.splice(index, 1);
                                        form.setValue("otherProducts", flwrs);
                                        console.log(flwrs, "qq");
                                        setAdditionalProducts((num) => num - 1);
                                      }}
                                      type="button"
                                      className="mt-0.5"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}

                          <Button
                            onClick={() =>
                              setAdditionalProducts((num) => num + 1)
                            }
                            size="sm"
                            className="mt-1"
                            type="button"
                          >
                            Add Product
                          </Button>

                          <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                        </FormItem>
                      )}
                    />
                    {/*<div className=" ">
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
                    </div>*/}
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
                        <h3 className="">Flowers Fee:</h3>
                        <span className="text-lg font-thin">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(flowerFees)}
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
                        <h3 className="">Additional Fees:</h3>
                        <span className="text-lg font-thin">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(additionalPrdctsFees || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="">Other Fees:</h3>
                        <span className="text-lg font-thin">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(product.otherFee || 0)}
                        </span>
                      </div>
                      {/*<div className="flex items-center justify-between">
                        <h3 className="">Other Fee:</h3>
                        <span className="text-lg font-thin">
                          {Intl.NumberFormat("en-PH", {
                            currency: "PHP",
                            style: "currency",
                          }).format(
                            (addedOtherFee || 0) + (product.otherFee || 0),
                          )}
                        </span>
                      </div>*/}
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
