import {
  Globe,
  Save,
  FileText,
  Image,
  Upload,
  Edit,
  Eye,
  Trash2,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Separator,
  InputWithIcon,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
} from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  READ_STORE_IMAGES_QUERY,
  UPDATE_STORE_SETTINGS_MUTATION,
} from "@/queries";
import { SystemSettingsSkeleton } from "../skeletons";
import { useMutation, useQuery } from "@apollo/client";

import { useAtom } from "jotai";
import { storeAtom } from "@/states";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "date-fns";
import { StoreImage } from "@/types";
import { Link, useLocation } from "react-router-dom";

const generalFormSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeEmail: z.string().email("Invalid email address"),
  storePhone: z.string().min(10, "Phone number must be at least 10 digits"),
  storeAddress: z.string().min(1, "Store address is required"),
  storeDescription: z.string().min(1, "Store description is required"),
  facebook: z.string().url("Invalid Facebook URL").optional(),
  instagram: z.string().url("Invalid Instagram URL").optional(),
  deliveryFee: z.string().min(1, "Delivery fee is required"),
});

const policyFormSchema = z.object({
  privacyPolicy: z.string().min(1, "Privacy policy is required"),
  termsOfService: z.string().min(1, "Terms of service is required"),
  returnPolicy: z.string().min(1, "Return policy is required"),
  shippingPolicy: z.string().min(1, "Shipping policy is required"),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;
type PolicyFormValues = z.infer<typeof policyFormSchema>;

export default function SystemSettings() {
  const [data, setData] = useAtom(storeAtom);
  const [updateStoreSettings, { loading: updating }] = useMutation(
    UPDATE_STORE_SETTINGS_MUTATION,
  );
  const { data: storeImagesData, loading: fetchingStoreImages } = useQuery<{
    storeImages: { data: StoreImage[]; hasNextPage: boolean; total: number };
  }>(READ_STORE_IMAGES_QUERY);
  const { toast } = useToast();
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const generalForm = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    values: {
      storeName: data.storeName || "",
      storeEmail: data.storeEmail || "",
      storePhone: data.storePhone || "",
      storeAddress: data.storeAddress || "",
      storeDescription: data.storeDescription || "",
      deliveryFee: String(data.deliveryFee),
      facebook: data.socialMedia.facebook || "",
      instagram: data.socialMedia.instagram || "",
    },
  });

  const policyForm = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    values: {
      privacyPolicy: data.policies.privacyPolicy || "",
      termsOfService: data.policies.termsOfService || "",
      returnPolicy: data.policies.returnPolicy || "",
      shippingPolicy: data.policies.shippingPolicy || "",
    },
  });

  async function onGeneralSubmit(values: GeneralFormValues) {
    try {
      const { data: updatedData } = await updateStoreSettings({
        variables: {
          ...values,
          policies: {
            privacyPolicy: data.policies.privacyPolicy,
            returnPolicy: data.policies.returnPolicy,
            shippingPolicy: data.policies.shippingPolicy,
            termsOfService: data.policies.termsOfService,
          },
          deliveryFee: Number(values.deliveryFee),
          socialMedia: {
            facebook: values.facebook,
            instagram: values.instagram,
          },
          id: data.id,
        },
      });

      setData(updatedData.settings);
      toast({
        title: "Settings updated successfully",
        description: "Your store settings have been updated successfully.",
        variant: "success",
      });

      // setData({})
    } catch (error) {
      toast({
        title: "Error updating settings",
        description: "An error occurred while updating your store settings.",
        variant: "destructive",
      });
      console.error("Error saving policy settings:", error);
    }
  }

  async function onPolicySubmit(values: PolicyFormValues) {
    try {
      const { data: updatedData } = await updateStoreSettings({
        variables: {
          ...data,
          policies: {
            privacyPolicy: values.privacyPolicy,
            returnPolicy: values.returnPolicy,
            shippingPolicy: values.shippingPolicy,
            termsOfService: values.termsOfService,
          },
          id: data.id,
        },
      });

      setData(updatedData.settings);
      toast({
        title: "Settings updated successfully",
        description: "Your store settings have been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving policy settings:", error);
      toast({
        title: "Error updating settings",
        description: "An error occurred while updating your store settings.",
        variant: "destructive",
      });
    }
  }

  if (!data) return <SystemSettingsSkeleton />;

  const submitting =
    updating ||
    generalForm.formState.isSubmitting ||
    policyForm.formState.isSubmitting;

  const CreateNewThemeBTN = () => (
    <Button className="ml-auto" asChild>
      <Link to="/settings/add-theme">
        <Upload className="h-4 w-4 mr-2" />
        Create New Theme
      </Link>
    </Button>
  );

  return (
    <Tabs
      defaultValue={searchParams.get("tab") || "general"}
      className="space-y-4"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 w-full">
        <TabsTrigger
          disabled={submitting}
          value="general"
          className="data-[state=active]:text-white"
        >
          <Globe className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">General</span>
        </TabsTrigger>
        <TabsTrigger
          disabled={submitting}
          value="policy"
          className="data-[state=active]:text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Policy & Terms</span>
        </TabsTrigger>
        <TabsTrigger
          disabled={submitting}
          value="theme"
          className="data-[state=active]:text-white"
        >
          <Image className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Theme Image</span>
        </TabsTrigger>
      </TabsList>

      {/* General Settings */}
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure your store information and general settings.
            </CardDescription>
          </CardHeader>
          <Form {...generalForm}>
            <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Store Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={submitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="storeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="storePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Phone</FormLabel>
                          <FormControl>
                            <InputWithIcon
                              {...field}
                              className=""
                              startIcon={
                                <p className="text-sm text-gray-500">+63</p>
                              }
                              inputProps={{
                                value: field.value,
                                onChange: field.onChange,
                                onBlur: field.onBlur,
                                readOnly: submitting,
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="storeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Address</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={submitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={generalForm.control}
                    name="storeDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Description</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={submitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Delivery Fee</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="deliveryFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={submitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      {/* Policy and Terms Settings */}
      <TabsContent value="policy">
        <Card>
          <CardHeader>
            <CardTitle>Policy and Terms</CardTitle>
            <CardDescription>
              Configure legal policies and terms for your store.
            </CardDescription>
          </CardHeader>
          <Form {...policyForm}>
            <form onSubmit={policyForm.handleSubmit(onPolicySubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy Policy</h3>
                  <FormField
                    control={policyForm.control}
                    name="privacyPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Privacy Policy Content</FormLabel>
                        <FormControl>
                          <Textarea rows={6} {...field} readOnly={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Terms of Service</h3>
                  <FormField
                    control={policyForm.control}
                    name="termsOfService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms of Service Content</FormLabel>
                        <FormControl>
                          <Textarea rows={6} {...field} readOnly={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Return Policy</h3>
                  <FormField
                    control={policyForm.control}
                    name="returnPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return Policy Content</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} readOnly={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipping Policy</h3>
                  <FormField
                    control={policyForm.control}
                    name="shippingPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Policy Content</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} readOnly={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      {/* Theme Image Settings */}
      <TabsContent value="theme">
        <Card>
          <CardHeader className="flex items-center justify-between flex-row">
            <div className="">
              <CardTitle>Theme Image Setting</CardTitle>
              <CardDescription>
                Configure the main image to visually represent your board’s
                theme.
              </CardDescription>
            </div>
            {(storeImagesData?.storeImages.data?.length ?? 0) > 0 && (
              <CreateNewThemeBTN />
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {fetchingStoreImages ? (
                <div className="flex flex-col gap-y-2  justify-center w-full items-center min-h-40">
                  <Loader className=" animate-spin w-16 h-16" />
                  <p className="text-xs">Fetching data...</p>
                </div>
              ) : !storeImagesData?.storeImages.data.length ||
                storeImagesData?.storeImages.data.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Upload className="mx-auto h-16 w-16 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No store images yet
                  </h3>
                  <p className="mb-4">
                    Create your first theme image collection to get started
                  </p>
                  <CreateNewThemeBTN />
                </div>
              ) : (
                <div className="grid gap-6">
                  {storeImagesData.storeImages.data.map((storeImage) => (
                    <Card key={storeImage.id} className="overflow-hidden">
                      <div className="flex flex-col lg:flex-row">
                        {/* Image Gallery */}
                        <div className="lg:w-1/3 p-4">
                          {storeImage.image.length > 0 ? (
                            <div className="space-y-2">
                              <img
                                src={
                                  storeImage.image[0].image ||
                                  "https://blocks.astratic.com/img/general-img-landscape.png"
                                }
                                alt={storeImage.image[0].alt}
                                className="w-full h-48 object-cover rounded-lg border"
                              />
                              {storeImage.image.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                  {storeImage.image
                                    .slice(1)
                                    .map((img, idx: number) => (
                                      <img
                                        key={idx}
                                        src={
                                          img.image ||
                                          "https://blocks.astratic.com/img/general-img-landscape.png"
                                        }
                                        alt={img.alt}
                                        className="w-16 h-16 object-cover rounded border flex-shrink-0"
                                      />
                                    ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="lg:w-2/3 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">
                                {storeImage.event}
                              </h3>
                              <p className="text-muted-foreground mb-4">
                                {storeImage.description}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                              <Button asChild variant="outline" size="sm">
                                <Link
                                  to={`/settings/edit-theme/${storeImage.id}`}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive bg-transparent"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">
                                START DATE
                              </Label>
                              <p className="font-medium">
                                {storeImage.startDate
                                  ? formatDate(
                                      storeImage.startDate,
                                      "MMM dd, yyyy",
                                    )
                                  : "Not set"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">
                                END DATE
                              </Label>
                              <p className="font-medium">
                                {storeImage.endDate
                                  ? formatDate(
                                      storeImage.endDate,
                                      "MMM dd, yyyy",
                                    )
                                  : "Not set"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">
                                IMAGES
                              </Label>
                              <p className="font-medium">
                                {storeImage.image.length} image(s)
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                            Created:{" "}
                            {storeImage.createdAt
                              ? formatDate(storeImage.createdAt, "MMM dd, yyyy")
                              : "Unknown"}{" "}
                            • Updated:{" "}
                            {storeImage.updatedAt
                              ? formatDate(storeImage.updatedAt, "MMM dd, yyyy")
                              : "Unknown"}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {storeImagesData?.storeImages.data.length &&
            storeImagesData.storeImages.data.length > 3 ? (
              <>
                <CreateNewThemeBTN />
              </>
            ) : null}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
