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
  CREATE_CUSTOMOMIZE_ORDER_MUTATION,
  GET_PRODUCT_QUERY,
  READ_COMPONENTS_QUERY,
} from "@/queries";
import { componentsAtom } from "@/states/components";
import { Component, Product } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Info, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { ComponentDetailsModal } from "../admin/components/component-modal";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  flower: z.string({
    message: "You must pick your preferred flower",
  }),
  wrapper: z.string({
    message: "You must pick your preferred wrapper",
  }),
  wrapperColor: z.string().optional(),
  note: z.string().optional(),
  totalPrice: z.number(),
});

type FormData = z.infer<typeof formSchema>;

const Customize2 = () => {
  const { productId } = useParams();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const [component, setComponent] = useState<Component | null>(null);
  const { toast } = useToast();
  const [createOrder, { loading: creatingOrder }] = useMutation(
    CREATE_CUSTOMOMIZE_ORDER_MUTATION,
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

  const watchedFlower = form.watch("flower");
  const watchedWrapper = form.watch("wrapper");

  useEffect(() => {
    if (watchedFlower && watchedWrapper) {
      const flower = flowerOptions.find((flr) => flr.id === watchedFlower);
      const wrapper = wrapperOptions.find((wrp) => wrp.id === watchedWrapper);

      let tot = product.price;
      tot -= wrapperOldPrice || 0;
      tot -= flowerOldPrice || 0;
      tot += flower?.price || 0;
      tot += wrapper?.price || 0;
      form.setValue("totalPrice", tot || 0);
    }
  }, [watchedFlower, watchedWrapper]);

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
      //
      const order = await createOrder({
        variables: {
          customData: {
            productId: product.id,
            note: values.note || "",
            totalPrice: values.totalPrice,
            components: [values.flower, values.wrapper],
            wrapperColor: values.wrapperColor || "",
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
                              disabled={creatingOrder}
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
                            disabled={creatingOrder}
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
                                disabled={creatingOrder}
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
                              isEditing={!creatingOrder}
                              handleValue={(editor) => {
                                form.setValue(
                                  "note",
                                  JSON.stringify(editor.getJSON()),
                                );
                              }}
                              content={form.formState.defaultValues?.note ?? ""}
                              editable={!creatingOrder}
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
                          }).format(product.otherFee || 0)}
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
                  <div className="w-full justify-end flex items-center mt-4">
                    <Button className="min-w-[100px]" disabled={creatingOrder}>
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
