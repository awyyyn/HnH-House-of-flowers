import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload, X } from "lucide-react";
import {
  format,
  isWithinInterval,
  getYear,
  setYear,
  getMonth,
  isEqual,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/components";
import { StoreImage } from "@/types";
import { toast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    event: z.string().min(1, "Event name is required"),
    description: z.string().optional(),
    startDate: z.date({ message: "Date must be valid" }),
    endDate: z.date({ message: "Date must be valid" }),
    images: z
      .array(
        z.object({
          image: z.string().url("Image must be a valid URL"),
          alt: z.string().min(1, "Alt text is required"),
        }),
      )
      .min(1, "At least one image is required"),
  })
  .required({
    startDate: true,
    endDate: true,
  });

type FormDataType = z.infer<typeof formSchema>;

interface ImageData {
  alt: string;
  image: string;
}

const existingStoreImages: StoreImage[] = [];

export default function CreateThemeForm() {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event: "",
      description: "",
      images: [],
      startDate: undefined,
      endDate: undefined,
    },
  });
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(
    new Set(),
  );
  const [] = use;

  const addImage = () => {
    const currentImages = form.getValues("images");
    form.setValue("images", [...currentImages, { alt: "", image: "" }]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
    );
  };

  const updateImage = (
    index: number,
    field: keyof ImageData,
    value: string,
  ) => {
    const currentImages = form.getValues("images");
    const updatedImages = currentImages.map((img, i) =>
      i === index ? { ...img, [field]: value } : img,
    );
    form.setValue("images", updatedImages);
  };

  const getDateRangesForValidation = () => {
    return existingStoreImages
      .map((img) => ({
        id: img.id,
        start: img.startDate,
        end: img.endDate,
        event: img.event,
      }))
      .filter((range) => range.start && range.end);
  };

  const adjustYearForEvent = (date: Date, isEndDate = false) => {
    const currentYear = getYear(new Date());
    let adjustedDate = setYear(date, currentYear);

    if (isEndDate) {
      const startDate = form.getValues("startDate");
      if (startDate) {
        const startMonth = getMonth(startDate);
        const endMonth = getMonth(date);

        if (startMonth === 11 && endMonth === 0) {
          adjustedDate = setYear(adjustedDate, currentYear + 1);
        }
      }
    }

    return adjustedDate;
  };

  const isDateDisabled = (date: Date, isEndDate = false) => {
    const adjustedDate = adjustYearForEvent(date, isEndDate);
    const existingRanges = getDateRangesForValidation();

    return existingRanges.some((range) => {
      if (!range.start || !range.end) return false;

      const rangeStart = setYear(range.start, getYear(adjustedDate));
      let rangeEnd = setYear(range.end, getYear(adjustedDate));

      if (getMonth(range.start) === 11 && getMonth(range.end) === 0) {
        rangeEnd = setYear(rangeEnd, getYear(adjustedDate) + 1);
      }

      return isWithinInterval(adjustedDate, {
        start: rangeStart,
        end: rangeEnd,
      });
    });
  };

  const validateDateRange = (
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) => {
    if (!startDate || !endDate) return { isValid: true, message: "" };

    const adjustedStartDate = adjustYearForEvent(startDate);
    const adjustedEndDate = adjustYearForEvent(endDate, true);

    const existingRanges = getDateRangesForValidation();
    const hasOverlap = existingRanges.some((range) => {
      if (!range.start || !range.end) return false;

      const rangeStart = setYear(range.start, getYear(adjustedStartDate));
      let rangeEnd = setYear(range.end, getYear(adjustedStartDate));

      if (getMonth(range.start) === 11 && getMonth(range.end) === 0) {
        rangeEnd = setYear(rangeEnd, getYear(adjustedStartDate) + 1);
      }

      return (
        isWithinInterval(adjustedStartDate, {
          start: rangeStart,
          end: rangeEnd,
        }) ||
        isWithinInterval(adjustedEndDate, {
          start: rangeStart,
          end: rangeEnd,
        }) ||
        isWithinInterval(rangeStart, {
          start: adjustedStartDate,
          end: adjustedEndDate,
        })
      );
    });

    if (hasOverlap) {
      const overlappingEvent = existingRanges.find((range) => {
        if (!range.start || !range.end) return false;

        const rangeStart = setYear(range.start, getYear(adjustedStartDate));
        let rangeEnd = setYear(range.end, getYear(adjustedStartDate));

        if (getMonth(range.start) === 11 && getMonth(range.end) === 0) {
          rangeEnd = setYear(rangeEnd, getYear(adjustedStartDate) + 1);
        }

        return (
          isWithinInterval(adjustedStartDate, {
            start: rangeStart,
            end: rangeEnd,
          }) ||
          isWithinInterval(adjustedEndDate, {
            start: rangeStart,
            end: rangeEnd,
          }) ||
          isWithinInterval(rangeStart, {
            start: adjustedStartDate,
            end: adjustedEndDate,
          })
        );
      });

      return {
        isValid: false,
        message: `Date range overlaps with existing event: ${overlappingEvent?.event}`,
      };
    }

    return { isValid: true, message: "" };
  };

  const [dateValidation, setDateValidation] = useState({
    isValid: true,
    message: "",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const validation = validateDateRange(value.startDate, value.endDate);
      setDateValidation(validation);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = (data: FormDataType) => {
    const validation = validateDateRange(data.startDate, data.endDate);
    if (!validation.isValid) {
      return;
    }
    console.log(data, "qq");
  };

  console.log(form.formState.errors, "qq err");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Image Setting</CardTitle>
        <CardDescription>
          Configure the main image to visually represent your board's theme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description (optional)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=" ">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? `${format(field.value, "PPP")} ${!isEqual(form.watch("startDate"), form.watch("endDate")) ? `- ${format(form.watch("endDate"), "PPP")}` : ""} `
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          numberOfMonths={2}
                          mode="range"
                          selected={{
                            from: form.watch("startDate"),
                            to:
                              form.watch("endDate") || form.watch("startDate"),
                          }}
                          onSelect={(date) => {
                            if (date?.from) {
                              form.setValue(
                                "startDate",
                                adjustYearForEvent(date.from),
                              );
                              form.clearErrors("startDate");
                            } else {
                              form.setError("startDate", {
                                message:
                                  "Start Date is required and must be valid!",
                              });
                            }

                            if (date?.to) {
                              form.setValue(
                                "endDate",
                                adjustYearForEvent(date.to, true),
                              );
                            }

                            if (!date?.to && date?.from) {
                              form.setValue(
                                "endDate",
                                adjustYearForEvent(date.from, true),
                              );
                            }
                          }}
                          // selected={field.value}
                          // onSelect={(date) => {
                          //   if (date) {
                          //     const adjustedDate = adjustYearForEvent(date);
                          //     field.onChange(adjustedDate);
                          //   } else {
                          //     field.onChange(date);
                          //   }
                          // }}
                          disabled={(date) => isDateDisabled(date, false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!dateValidation.isValid && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-medium">
                  {dateValidation.message}
                </p>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Events are recurring yearly. If your
                event starts in December and ends in January, the end date will
                automatically be set to the following year.
              </p>
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Theme Images</FormLabel>
                    <Button
                      type="button"
                      onClick={addImage}
                      variant="outline"
                      size="sm"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                  </div>

                  {field.value.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                      <Upload className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No images added yet</p>
                      <p className="text-sm">
                        Click "Add Image" to get started
                      </p>
                    </div>
                  )}

                  {field.value
                    .map((image, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-4">
                            {!image.image.trim() && (
                              <div className="space-y-2">
                                <Label htmlFor={`image-upload-${index}`}>
                                  Upload Image
                                </Label>

                                <div
                                  className={` rounded-lg p-4 ${image.image ? "" : "border-2 border-dashed border-border"}`}
                                >
                                  {!uploadingImages.has(index) && (
                                    <FileUpload
                                      onFileUpload={(files) => {
                                        if (files.length > 0) {
                                          setUploadingImages((prev) =>
                                            new Set(prev).add(index),
                                          );
                                          const file = files[0];
                                          const url = `https://api.cloudinary.com/v1_1/${
                                            import.meta.env
                                              .VITE_CLOUDINARY_CLOUD_NAME
                                          }/upload`;
                                          const fd = new FormData();
                                          // fd.append("upload_preset", unsignedUploadPreset);
                                          fd.append("upload_preset", "avatars");
                                          fd.append("tags", "user-avatar"); // Optional - add tags for image admin in Cloudinary
                                          fd.append("tags", "browser-upload"); // Optional - add tags for image admin in Cloudinary
                                          fd.append("file", file);

                                          fetch(url, {
                                            method: "POST",
                                            body: fd,
                                          })
                                            .then((response) => response.json())
                                            .then((data) => {
                                              updateImage(
                                                index,
                                                "image",
                                                data.url,
                                              );
                                              if (!image.alt) {
                                                updateImage(
                                                  index,
                                                  "alt",
                                                  file.name.replace(
                                                    /\.[^/.]+$/,
                                                    "",
                                                  ),
                                                );
                                              }

                                              toast({
                                                title: "Success",
                                                description:
                                                  "Image uploaded successfully",
                                                variant: "success",
                                              });
                                            })
                                            .catch((error) => {
                                              console.error(
                                                "Error uploading the file:",
                                                error,
                                              );
                                              toast({
                                                title: "Error",
                                                description:
                                                  "Error uploading the file",
                                                variant: "destructive",
                                              });
                                            })
                                            .finally(() => {
                                              setUploadingImages((prev) => {
                                                const newSet = new Set(prev);
                                                newSet.delete(index);
                                                return newSet;
                                              });
                                            });
                                        }
                                      }}
                                      showText={true}
                                    />
                                  )}
                                  {uploadingImages.has(index) && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                      Uploading image...
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="space-y-2">
                              <Label htmlFor={`image-alt-${index}`}>
                                Alt Text
                              </Label>
                              <Input
                                id={`image-alt-${index}`}
                                placeholder="Describe the image for accessibility"
                                value={image.alt}
                                onChange={(e) =>
                                  updateImage(index, "alt", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {image.image && (
                          <div className="mt-4">
                            <img
                              src={image.image || "/placeholder.svg"}
                              alt={image.alt || "Preview"}
                              className="max-w-full h-32 object-cover rounded-md border"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </Card>
                    ))
                    .reverse()}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
          // disabled={!dateValidation.isValid || !form.formState.isValid}
        >
          Save Theme Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
