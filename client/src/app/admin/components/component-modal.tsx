import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Calendar, Palette, PhilippinePeso } from "lucide-react";
import { Component } from "@/types";
import { formatDate } from "date-fns";
import { Button, RichTextEditor } from "@/components";

interface ComponentDetailsModalProps {
  component: Component;
  isOpen: boolean;
  handleClose: VoidFunction;
  handleNavigate: VoidFunction;
}

export function ComponentDetailsModal({
  component,
  isOpen,
  handleClose,
  handleNavigate,
}: ComponentDetailsModalProps) {
  const formatPrice = (price?: number) => {
    if (!price) return "Free";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  const renderColorPreviews = (colors: string[]) => {
    if (!colors.length)
      return (
        <span className="text-muted-foreground text-sm">
          No colors available
        </span>
      );

    return (
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted"
          >
            <div
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
            <span className="text-xs font-medium">{color}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {component.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={
                  component.image ||
                  "https://blocks.astratic.com/img/general-img-landscape.png"
                }
                alt={component.name}
                className="w-48 h-48 object-cover rounded-lg border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/electronic-component.png";
                }}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={component.isAvailable ? "default" : "destructive"}
                >
                  {component.isAvailable ? "Available" : "Unavailable"}
                </Badge>
                <Badge variant="outline">{component.type}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <PhilippinePeso className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-lg font-semibold">
                          {formatPrice(component.price)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Quantity
                        </p>
                        <p className="text-lg font-semibold">
                          {component.quantity}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {component.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <RichTextEditor
                    content={component.description}
                    editable={false}
                    isEditing={false}
                    handleValue={() => {}}
                  />
                </p>
              </CardContent>
            </Card>
          )}

          {component.type === "WRAPPER" && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4" />
                  <h3 className="font-semibold">Available Colors</h3>
                </div>
                {renderColorPreviews(component.availableColors)}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4" />
                <h3 className="font-semibold">Timeline</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {formatDate(component.createdAt, "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {formatDate(component.updatedAt, "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Component ID</h3>

              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {component.id}
              </code>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleNavigate}>
            Edit
          </Button>
          <Button type="button" onClick={handleClose} variant="destructive">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
