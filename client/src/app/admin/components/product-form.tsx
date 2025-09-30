import {
  Button,
  FileUpload,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import {
  flowerTagOptions,
  flowerVariantOptions,
  productCategory,
  productStatus,
} from "@/constants";
import { useToast } from "@/hooks/use-toast";
import {
  CREATE_PRODUCT_MUTATION,
  GET_PRODUCT_QUERY,
  GET_PRODUCTS_QUERY,
  READ_COMPONENTS_QUERY,
  UPDATE_PRODUCT_MUTATION,
} from "@/queries";
import { Component, Product, ProductStatus } from "@/types";
import { useMutation, useQuery } from "@apollo/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { TagsInput } from "./tags-input";
import { useAtom } from "jotai";
import { componentsAtom } from "@/states/components";

const formSchema = z
  .object({
    name: z.string().nonempty("Required"),
    description: z.string().optional(),
    price: z.string().nonempty("Required"),
    stock: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().positive(),
    ),
    images: z.array(z.string()).min(1, "Required"),
    category: z.string().nonempty("Required"),
    status: z.string().nonempty("Required"),
    tags: z.array(z.string()).optional(),
    flowerVariant: z
      .enum(
        [
          "HANDMADE",
          "FRESH",
          "IMPORTED_FLOWER",
          "DRIED_FLOWER",
          "MONEY_BOUQUET",
          "BOBO_BALLOONS",
        ],
        {
          message: "You must select a flower variant",
        },
      )
      .optional()
      .nullable(),
    otherFee: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      },
      z
        .number({
          message: "Other fee must be a number",
        })
        .optional(),
    ),
    serviceFee: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      },
      z
        .number({
          message: "Service fee must be a number",
        })
        .optional(),
    ),
    wrapper: z.string().optional(),
    flower: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.category === "FLOWER") {
      if (!data.flowerVariant) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["flowerVariant"],
          message: "Flower variant is required for flower components",
        });
      }
    }
    if (isNaN(parseInt(data.price))) {
      ctx.addIssue({
        path: ["price"],
        code: z.ZodIssueCode.custom,
        message: "Price must be a valid number",
      });
    } else if (data.price.trim() === "" || data.price === "0") {
      ctx.addIssue({
        path: ["price"],
        code: z.ZodIssueCode.custom,
        message: "Price is invalid or zero",
      });
    }
    if (data.category === "BOUQUET") {
      if (!data.tags || data.tags.length === 0) {
        ctx.addIssue({
          path: ["tags"],
          code: z.ZodIssueCode.custom,
          message: "Tags are required for bouquets",
        });
      }
      if (!data.serviceFee || isNaN(data.serviceFee)) {
        ctx.addIssue({
          path: ["serviceFee"],
          code: z.ZodIssueCode.custom,
          message: "Service fee is required for bouquets",
        });
      }

      if (!data.flower || data.flower.trim() === "") {
        ctx.addIssue({
          path: ["flower"],
          code: z.ZodIssueCode.custom,
          message: "Flower component is required for bouquets",
        });
      }

      if (!data.wrapper || data.wrapper.trim() === "") {
        ctx.addIssue({
          path: ["wrapper"],
          code: z.ZodIssueCode.custom,
          message: "Wrapper component is required for bouquets",
        });
      }
    }
  });

export default function ProductForm({
  editing = false,
  product,
}: {
  editing?: boolean;
  product?: Product;
}) {
  const [uploading, setUploading] = useState(false);
  const [imgs, setImgs] = useState<string[]>(product?.images ?? []);
  const { toast } = useToast();
  const [componentsState, setComponentsState] = useAtom(componentsAtom);
  // const [isEditing, setIsEditing] = useState(editing);
  const navigate = useNavigate();
  const [addProduct] = useMutation(
    editing ? UPDATE_PRODUCT_MUTATION : CREATE_PRODUCT_MUTATION,
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price.toString() ?? "",
      stock: product?.stock ?? 1,
      images: product?.images ?? [],
      category: product?.category ?? "",
      status: product?.status ?? "",
      tags: product?.tags ?? [],
      serviceFee: product?.serviceFee ?? 0,
      otherFee: product?.otherFee ?? 0,
      flower: product?.components[0]?.id ?? "",
      wrapper: product?.components[1]?.id ?? "",
      flowerVariant: product?.flowerVariant,
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

  useEffect(() => {
    form.setValue("images", imgs);
  }, [imgs, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const components = [];
      const isBuoquet = values.category === "BOUQUET";
      if (values.flower && values.flower.trim() !== "")
        components.push(values.flower);
      if (values.wrapper && values.wrapper.trim() !== "")
        components.push(values.wrapper);
      // eslint-disable-next-line
      const data: any = {
        name: values.name,
        price: Number(values.price),
        stock: values.stock,
        status: values.status as ProductStatus,
        category: values.category,
        images: values.images,
        description: values.description,
        tags: isBuoquet || values.category === "FLOWER" ? values.tags : [],
        serviceFee: isBuoquet ? values.serviceFee : 0,
        otherFee: isBuoquet ? values.otherFee : 0,
        components: isBuoquet ? components : [],
        flowerVariant: values.flowerVariant,
      };

      const variables = editing ? { id: String(product?.id), data } : data;

      await addProduct({
        variables,
        refetchQueries: [GET_PRODUCTS_QUERY, GET_PRODUCT_QUERY],
      });

      navigate("/products");

      toast({
        title: "Success",
        description: editing
          ? "Product updated successfully"
          : "Product created successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  console.log(form.formState.errors, "qqqq");

  const handleFileUpload = (files: File[]) => {
    const url = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/upload`;
    const fd = new FormData();
    // fd.append("upload_preset", unsignedUploadPreset);
    fd.append("upload_preset", "avatars");
    fd.append("tags", "user-avatar"); // Optional - add tags for image admin in Cloudinary
    fd.append("tags", "browser-upload"); // Optional - add tags for image admin in Cloudinary
    fd.append("file", files[0]);
    setUploading(true);
    fetch(url, {
      method: "POST",
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        setImgs((images) => [...images, data.url]);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
          variant: "success",
        });
      })
      .catch((error) => {
        console.error("Error uploading the file:", error);
        toast({
          title: "Error",
          description: "Error uploading the file",
          variant: "destructive",
        });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const watchedCategory = form.watch("category");
  const shouldShowTags = ["FLOWER", "BOUQUET"].includes(watchedCategory);
  const shouldShowComponents = watchedCategory === "BOUQUET";
  const flowerOptions = (
    componentsState.filter((comp) => comp.type === "FLOWER") || []
  ).filter((f) => f.isAvailable && f.quantity > 0);
  const wrapperOptions =
    componentsState.filter((comp) => comp.type === "WRAPPER") || [];
  const category = form.watch("category");
  const flower = form.watch("flower");
  const wrapper = form.watch("wrapper");
  const serviceFee = form.watch("serviceFee");
  const otherFee = form.watch("otherFee");

  // Auto-update price when any of the watched values change
  useMemo(() => {
    if (category === "BOUQUET") {
      const flowerPrice =
        flowerOptions.find((f) => f.id === flower)?.price || 0;

      const wrapperPrice =
        wrapperOptions.find((w) => w.id === wrapper)?.price || 0;

      const calculatedPrice =
        Number(flowerPrice) +
        Number(wrapperPrice) +
        Number(serviceFee || 0) +
        Number(otherFee || 0);

      form.setValue("price", calculatedPrice.toString());
      if (calculatedPrice > 0) form.clearErrors("price");
    } else {
      form.setValue("serviceFee", 0);
      form.setValue("otherFee", 0);
      form.setValue("flower", "");
      form.setValue("wrapper", "");
    }
  }, [category, flower, wrapper, serviceFee, otherFee]);

  // TODO: ADD LOADING UI

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex items-center justify-between ">
          <div className="md:px-5">
            <h1 className="text-2xl font-semibold dark:text-white">
              {editing ? "Edit Product" : "Add Product"}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {/*<Button variant="ghost" type="reset" onClick={() => form.reset()}>
              Reset
            </Button>*/}
            <Button type="submit">
              {form.formState.isSubmitting ? (
                <>
                  <Loader className="animate-spin" />
                  {editing ? "Updating..." : "Saving..."}
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
        <div className="grid  grid-cols-1 lg:grid-cols-9  gap-3 grid-flow-dense">
          <div className="col-span-5 order-2 md:order-1 p-5 space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-black dark:text-white ">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      readOnly={form.formState.isSubmitting}
                      placeholder=""
                      className="dark:border-primarsy/50 dark:bg-zinc-900"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-primary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-black dark:text-white ">
                    Description
                  </FormLabel>
                  <FormControl className="w-full">
                    <RichTextEditor
                      handleValue={(editor) => {
                        form.setValue(
                          "description",
                          JSON.stringify(editor.getJSON()),
                        );
                      }}
                      content={form.formState.defaultValues?.description ?? ""}
                      editable
                    />
                  </FormControl>
                  <FormMessage className="dark:text-primary" />
                </FormItem>
              )}
            />

            <div className={`flex flex-col  gap-4 items-start md:flex-row `}>
              {!shouldShowComponents && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-start">
                      <FormLabel className="text-black dark:text-white ">
                        Price
                      </FormLabel>
                      <Input
                        className="dark:bg-zinc-900 "
                        type="number"
                        {...field}
                      />
                      <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start">
                    <FormLabel className="text-black dark:text-white ">
                      Stock
                    </FormLabel>
                    <Input {...field} className="dark:bg-zinc-900" />
                    <FormMessage className="dark:text-primary" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col  gap-4 items-start md:flex-row">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start">
                    <FormLabel className="text-black dark:text-white ">
                      Product Category
                    </FormLabel>

                    <Select
                      onValueChange={(v) => {
                        field.onChange(v);

                        if (v !== "FLOWER") {
                          form.resetField("flowerVariant");
                        }
                      }}
                      defaultValue={form.getValues("category")}
                    >
                      <SelectTrigger className="w-full border-gray-300 dark:bg-zinc-900">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Product Category</SelectLabel>
                          {productCategory.map((status) => (
                            <SelectItem
                              value={status}
                              key={status}
                              className="capitalize"
                            >
                              {status.split("_").join(" ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start">
                    <FormLabel className="text-black dark:text-white ">
                      Status
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={form.getValues("status")}
                    >
                      <SelectTrigger className="w-full  dark:bg-zinc-900">
                        <SelectValue placeholder="Select a status	" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Product Status</SelectLabel>
                          {productStatus.map((status) => (
                            <SelectItem
                              value={status}
                              key={status}
                              className="capitalize"
                            >
                              {status.split("_").join(" ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage className="dark:text-primary" />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("category") === "FLOWER" && (
              <>
                <FormField
                  control={form.control}
                  name="flowerVariant"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="text-black  dark:text-white ">
                        Flower Variant
                      </FormLabel>
                      <ToggleGroup
                        className=""
                        value={field.value === null ? undefined : field.value}
                        onValueChange={field.onChange}
                        type="single"
                        unselectable="on"
                      >
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full">
                          {flowerVariantOptions.map((flower) => (
                            <ToggleGroupItem
                              key={flower.value}
                              value={flower.value}
                              aria-label={`Toggle ${flower.label}`}
                            >
                              <span>{flower.label}</span>
                            </ToggleGroupItem>
                          ))}
                        </div>
                      </ToggleGroup>
                      <FormMessage className="dark:text-primary" />
                    </FormItem>
                  )}
                />
              </>
            )}

            {shouldShowTags && (
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className={`flex flex-col items-start w-full`}>
                      <FormLabel className="text-black dark:text-white ">
                        Tags
                      </FormLabel>
                      <FormControl className="w-full">
                        <TagsInput
                          onChangeValue={field.onChange}
                          options={flowerTagOptions}
                          value={field.value || []}
                        />
                      </FormControl>

                      <FormMessage className="dark:text-primary" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {shouldShowComponents && (
              <>
                <div className="">
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
                              onValueChange={field.onChange}
                              defaultValue={form.getValues("flower")}
                            >
                              <SelectTrigger className="w-full border-gray-300 dark:bg-zinc-900">
                                <SelectValue placeholder="Select a flower" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Flowers</SelectLabel>
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
                        </div>
                        <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="">
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
                              defaultValue={form.getValues("wrapper")}
                            >
                              <SelectTrigger className="w-full border-gray-300 dark:bg-zinc-900">
                                <SelectValue placeholder="Select a flower" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Wrappers</SelectLabel>
                                  {wrapperOptions.map((wrapper) => (
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
                                wrapperOptions.find(
                                  (wrapper) =>
                                    wrapper.id === form.getValues().wrapper,
                                )?.price || 0,
                              )}
                            </p>
                          </div>
                        </div>
                        <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                      </FormItem>
                    )}
                  />
                </div>
                <div
                  className={`flex flex-col  gap-4 items-start md:flex-row `}
                >
                  <FormField
                    control={form.control}
                    name="serviceFee"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col items-start">
                        <FormLabel className="text-black dark:text-white ">
                          Service Fee
                        </FormLabel>
                        <Input {...field} className="dark:bg-zinc-900 " />
                        <FormMessage className="dark:text-primary dark:bg-zinc-900" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otherFee"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col items-start">
                        <FormLabel className="text-black dark:text-white ">
                          Other Fee
                        </FormLabel>
                        <Input {...field} className="dark:bg-zinc-900" />
                        <FormMessage className="dark:text-primary" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-start">
                      <FormLabel className="text-black dark:text-white ">
                        Total Price
                      </FormLabel>
                      <Input readOnly {...field} className="dark:bg-zinc-900" />
                      <FormMessage className="dark:text-primary" />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <div className="col-span-4 order-1">
            <div className="p-5">
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-black dark:text-white ">
                      Image
                    </FormLabel>
                    <FormControl>
                      <div
                        className={`w-full relative h-96  dark:bg-zinc-900 border-2 group rounded-lg border-gray-200 dark:border-zinc-800`}
                      >
                        {imgs.length > 0 ? (
                          <>
                            <div className="absolute cursor-pointer place-content-center z-50 backdrop-blur-md  hidden group-hover:grid h-full w-full">
                              <Button
                                onClick={() => {
                                  const newImages = imgs.filter(
                                    (img) => imgs[0] !== img,
                                  );
                                  setImgs(newImages);
                                }}
                                type="button"
                              >
                                Remove
                              </Button>
                            </div>
                            <img
                              src={imgs[0]}
                              alt="product img"
                              className="absolute w-full h-full object-contain group rounded-lg"
                            />
                          </>
                        ) : (
                          <>
                            {uploading ? (
                              <div className="z-[80] h-full w-full grid place-content-center">
                                <Loader className="animate-spin" />
                              </div>
                            ) : (
                              <>
                                <FileUpload
                                  showText
                                  onFileUpload={handleFileUpload}
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="dark:text-primary" />
                  </FormItem>
                )}
              />
            </div>
            <div className="overflow-x-auto pt-5 flex gap-2 px-5 pb-5">
              {imgs.length > 1 &&
                imgs.slice(1).map((image, index) => (
                  <div
                    className="h-[100px] group relative min-w-[100px] dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 rounded-md  "
                    key={index}
                  >
                    <span
                      onClick={() => {
                        const newImages = imgs.filter((img) => image !== img);
                        setImgs(newImages);
                      }}
                      className="absolute -top-2 hidden group-hover:block cursor-pointer -right-2 dark:hover:bg-white z-[40] rounded-full transition-all"
                    >
                      <X className="dark:text-white dark:hover:text-primary" />
                    </span>
                    <img
                      src={image}
                      alt={`Image ${index}`}
                      className="absolute h-full w-full object-contain"
                    />
                  </div>
                ))}
              {imgs.length > 0 && imgs.length < 6 && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <div className="h-[100px] flex-col  cursor-pointer flex items-center justify-center relative max-w-[100px] min-w-[100px] rounded-md dark:bg-zinc-900">
                        {uploading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <FileUpload onFileUpload={handleFileUpload} />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="flex p-2 items-center gap-2">
                      {uploading ? (
                        <>
                          <Loader className="animate-spin" />
                          <p>Add More</p>
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          <p>Add More</p>
                        </>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
        <div className="flex  md:hidden items-center justify-end px-5 gap-2">
          <Button
            variant="ghost"
            type="reset"
            onClick={() => {
              form.reset();
            }}
          >
            Reset
          </Button>
          <Button type="submit">
            {form.formState.isSubmitting ? (
              <>
                <Loader className="animate-spin" />
                {editing ? "Updating..." : "Saving..."}
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
