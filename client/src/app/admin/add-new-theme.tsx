import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FileUpload,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@/components";
import { cn } from "@/lib";
import { CalendarIcon, Upload, X } from "lucide-react";

const AddNewTheme = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Image Setting</CardTitle>
        <CardDescription>
          Configure the main image to visually represent your board's theme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="event">Event Name</Label>
            <Input id="event" placeholder="Enter event name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter event description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      // !formData.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {/*{formData.startDate
                      ? format(formData.startDate, "PPP")
                      : "Pick a date"}*/}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    // selected={formData.startDate}
                    // onSelect={(date) =>
                    //   setFormData((prev) => ({ ...prev, startDate: date }))
                    // }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      // !formData.endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {/*{formData.endDate
                      ? format(formData.endDate, "PPP")
                      : "Pick a date"}*/}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    // selected={formData.endDate}
                    // onSelect={(date) =>
                    //   setFormData((prev) => ({ ...prev, endDate: date }))
                    // }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Theme Images</Label>
              <Button
                type="button"
                // onClick={addImage}
                variant="outline"
                size="sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </div>

            {/*{formData.images.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <Upload className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No images added yet</p>
                <p className="text-sm">Click "Add Image" to get started</p>
              </div>
            )}*/}

            {[].map((image, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`image-upload-${index}`}>
                        Upload Image
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4">
                        <FileUpload
                          onFileUpload={(files) => {
                            // if (files.length > 0) {
                            //   const file = files[0];
                            //   const imageUrl = URL.createObjectURL(file);
                            //   updateImage(index, "image", imageUrl);
                            //   // Set default alt text based on filename
                            //   if (!image.alt) {
                            //     updateImage(
                            //       index,
                            //       "alt",
                            //       file.name.replace(/\.[^/.]+$/, ""),
                            //     );
                            //   }
                            // }
                          }}
                          showText={true}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`image-alt-${index}`}>Alt Text</Label>
                      <Input
                        id={`image-alt-${index}`}
                        placeholder="Describe the image for accessibility"
                        // value={image.alt}
                        // onChange={(e) =>
                        //   updateImage(index, "alt", e.target.value)
                        // }
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    // onClick={() => removeImage(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/*{image.image && (
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
                )}*/}
              </Card>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          // onClick={handleSubmit}
        >
          Save Theme Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddNewTheme;
