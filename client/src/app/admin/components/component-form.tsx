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
  IOSSwitchWithLabels,
  RichTextEditor,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components";
import { toast } from "@/hooks/use-toast";
import { Component, ComponentType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextArrayInput } from "./color-input";
import {
  CREATE_COMPONENT_MUTATION,
  UPDATE_COMPONENT_MUTATION,
} from "@/queries";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { flowerVariantOptions } from "@/constants";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    stock: z.number({ message: "Stock must be a number!" }),
    price: z
      .number({ message: "Invalid price input, must be numbers only!" })
      .min(0, "Price must be a positive number"),
    // stock: z.number().positive("Stock must be a positive number"),
    image: z.string().optional(),
    type: z.enum(["WRAPPER", "FLOWER"], { message: "You must select a type" }),
    isAvailable: z.boolean().default(true),
    availableColors: z.array(z.string()).optional(),
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
      .optional(),
  })
  .required({
    stock: true,
  })
  .superRefine((data, ctx) => {
    if (data.type === "FLOWER") {
      if (!data.flowerVariant) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["flowerVariant"],
          message: "Flower variant is required for flower components",
        });
      }
    }
  });

type FormDataType = z.infer<typeof formSchema>;

interface AddComponentProps {
  value?: Component;
  isEditing?: boolean;
}

const ComponentForm = ({ value, isEditing = false }: AddComponentProps) => {
  const [uploading, setUploading] = useState(false);
  const [img, setImg] = useState<string>(value?.image || "");
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      availableColors: value?.availableColors || [],
      description: value?.description || "",
      image: value?.image || "",
      isAvailable: value?.isAvailable || true,
      name: value?.name || "",
      price: value?.price || 1,
      type: value?.type || "FLOWER",
      flowerVariant: value?.flowerVariant || "FRESH",
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (value) {
      form.setValue("name", value.name);
      form.setValue("description", value.description || "");
      form.setValue("stock", value.quantity || 1);
      form.setValue("price", value.price || 1);
      form.setValue("image", value.image || "");
      form.setValue("type", value.type || "FLOWER");
      form.setValue("isAvailable", value.isAvailable || true);
      form.setValue("availableColors", value.availableColors || []);
      form.setValue("flowerVariant", value.flowerVariant);
    }
  }, [value]);

  const [componentMutation] = useMutation(
    isEditing ? UPDATE_COMPONENT_MUTATION : CREATE_COMPONENT_MUTATION,
  );

  async function handleSubmit(values: FormDataType) {
    try {
      const data = {
        name: values.name,
        quantity: values.stock,
        description: values.description,
        price: values.price || 0,
        image: img || "",
        type: values.type,
        isAvailable: values.isAvailable,
        availableColors: values.availableColors || [],
        flowerVariant: values.flowerVariant,
      };

      const variables =
        isEditing && value?.id ? { id: value.id, ...data } : data;

      await componentMutation({
        variables,
      });

      navigate("/components");

      toast({
        title: "Success",
        description: isEditing
          ? "Component updated successfully"
          : "component created successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }

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
        setImg(data.url);
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

  useEffect(() => {
    form.setValue("image", img);
  }, [img]);

  return (
    <Form {...form}>
      <form
        className="space-y-5 container mx-auto px-5 "
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            {isEditing && (
              <Button
                type="button"
                size="icon"
                onClick={() => window.history.back()}
              >
                <ChevronLeft />
              </Button>
            )}
            <h1 className="text-2xl font-semibold dark:text-white">
              {isEditing ? "Edit Bouquet Component" : "Add Bouquet Component"}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex mr-10 flex-row items-center w-full">
                  <div className="flex ml-5 items-center gap-3">
                    <IOSSwitchWithLabels
                      rightLabel="Available"
                      size="sm"
                      leftLabel="Not Available"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                  <FormMessage className="dark:text-primary" />
                </FormItem>
              )}
            />
            <Button variant="ghost" type="reset" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit">
              {form.formState.isSubmitting ? (
                <>
                  <Loader className="animate-spin" />
                  {isEditing ? "Updating..." : "Saving..."}
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
        <div className="grid  grid-cols-1 lg:grid-cols-9  gap-3 grid-flow-dense">
          <div className="col-span-4 order-1 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
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
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black dark:text-white ">
                      Price
                    </FormLabel>
                    <Input
                      {...field}
                      className="dark:bg-zinc-900 "
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />

                    <FormMessage className="dark:text-primary" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black dark:text-white ">
                      Stock
                    </FormLabel>
                    <Input
                      type="number"
                      className="dark:bg-zinc-900 "
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <FormMessage className="dark:text-primary" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-black  dark:text-white ">
                    Component Type
                  </FormLabel>
                  <ToggleGroup
                    className=""
                    value={field.value}
                    onValueChange={field.onChange}
                    type="single"
                    unselectable="on"
                  >
                    <ToggleGroupItem
                      value={ComponentType.WRAPPER}
                      aria-label="Toggle wrapper"
                      onClick={() => {
                        form.resetField("flowerVariant");
                      }}
                    >
                      <span>Wrapper</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value={ComponentType.FLOWER}
                      aria-label="Toggle flower"
                    >
                      <span>Flower</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <FormMessage className="dark:text-primary" />
                </FormItem>
              )}
            />

            {form.watch("type") === "FLOWER" && (
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
                        value={field.value}
                        onValueChange={field.onChange}
                        type="single"
                        unselectable="on"
                      >
                        {flowerVariantOptions.map((flower) => (
                          <ToggleGroupItem
                            key={flower.value}
                            value={flower.value}
                            aria-label={`Toggle ${flower.label}`}
                          >
                            <span>{flower.label}</span>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      <FormMessage className="dark:text-primary" />
                    </FormItem>
                  )}
                />
              </>
            )}

            {form.watch("type") === "WRAPPER" && (
              <FormField
                control={form.control}
                name="availableColors"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-black  dark:text-white ">
                      Available Colors
                    </FormLabel>
                    <TextArrayInput
                      className="w-full"
                      showAbove={false}
                      onChangeValue={field.onChange}
                      value={field.value || []}
                    />
                    <FormMessage className="dark:text-primary" />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="col-span-5 order-2 md:order-1 p-5 space-y-5">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-black dark:text-white ">
                    Image
                  </FormLabel>
                  <FormControl>
                    <div
                      className={`w-full relative h-96  dark:bg-zinc-900 border-2 group rounded-lg border-gray-200 dark:border-zinc-800`}
                    >
                      {img.length > 0 ? (
                        <>
                          <div className="absolute cursor-pointer place-content-center z-50 backdrop-blur-md  hidden group-hover:grid h-full w-full">
                            <Button type="button">Remove</Button>
                          </div>
                          <img
                            src={img[0]}
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
        </div>

        <div className="flex pb-10 md:hidden items-center justify-end px-5 gap-2">
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center w-full">
                <div className="flex ml-5 items-center gap-3">
                  <IOSSwitchWithLabels
                    rightLabel="Available"
                    size="sm"
                    leftLabel="Not Available"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
                <FormMessage className="dark:text-primary" />
              </FormItem>
            )}
          />
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
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ComponentForm;
