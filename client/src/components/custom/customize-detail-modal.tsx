"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  PackageIcon,
  PaletteIcon,
  DollarSignIcon,
  FileTextIcon,
  Info,
} from "lucide-react";
import { Customize } from "@/types";
import { RichTextEditor } from "./rich-text-editor";

interface CustomizeDetailsModalProps {
  customize: Customize;
  trigger?: React.ReactNode;
}

export function CustomizeDetailsModal({
  customize,
  trigger,
}: CustomizeDetailsModalProps) {
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "N/A";
    return `$${price.toFixed(2)}`;
  };

  const getColorPreview = (color?: string) => {
    if (!color) return null;
    return (
      <div
        className="w-4 h-4 rounded-full border border-gray-300 inline-block mr-2"
        style={{ backgroundColor: color.toLowerCase() }}
        title={color}
      />
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Info />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5" />
            {customize.name}
          </DialogTitle>
          <DialogDescription>Customize ID: {customize.id}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileTextIcon className="w-4 h-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-sm font-semibold">{customize.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Total Price
                  </label>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    <DollarSignIcon className="w-3 h-3" />
                    {formatPrice(customize.totalPrice)}
                  </p>
                </div>
              </div>

              {customize.note && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Note
                  </label>
                  <RichTextEditor
                    content={customize.note}
                    editable={false}
                    isEditing={false}
                    handleValue={() => {}}
                  />
                </div>
              )}

              {customize.wrapperColor && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Wrapper Color
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    {getColorPreview(customize.wrapperColor)}
                    <span className="text-sm font-medium capitalize">
                      {customize.wrapperColor}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Information */}
          {customize.product && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PackageIcon className="w-4 h-4" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {customize.product.images[0] && (
                    <div className="flex-shrink-0">
                      <img
                        src={
                          customize.product.images[0] ||
                          "https://blocks.astratic.com/img/general-img-landscape.png"
                        }
                        alt={customize.product.name}
                        className="w-16 h-16 object-cover rounded-md
                        "
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://blocks.astratic.com/img/general-img-landscape.png";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Product Name
                      </label>
                      <p className="text-sm font-semibold">
                        {customize.product.name}
                      </p>
                    </div>
                    {customize.product.description && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Description
                        </label>
                        <RichTextEditor
                          content={customize.product.description}
                          editable={false}
                          isEditing={false}
                          handleValue={() => {}}
                        />
                      </div>
                    )}
                    {customize.product.price && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Product Price
                        </label>
                        <p className="text-sm font-semibold">
                          {formatPrice(customize.product.price)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Components */}
          {customize.components && customize.components.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PaletteIcon className="w-4 h-4" />
                  Components ({customize.components.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {customize.components.map((component) => (
                    <div
                      key={component.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <img
                            src={
                              component.image ||
                              "https://blocks.astratic.com/img/general-img-landscape.png"
                            }
                            alt={component.name}
                            className="w-12 h-12 object-cover rounded-md  "
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://blocks.astratic.com/img/general-img-landscape.png";
                            }}
                          />

                          <div className="space-y-1">
                            <h4 className="font-semibold text-sm">
                              {component.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  component.isAvailable
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {component.isAvailable
                                  ? "Available"
                                  : "Out of Stock"}
                              </Badge>
                              <Badge variant="outline">{component.type}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-semibold">
                            {formatPrice(component.price)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {component.quantity}
                          </p>
                        </div>
                      </div>

                      {component.description && (
                        <RichTextEditor
                          content={component.description}
                          editable={false}
                          isEditing={false}
                          handleValue={() => {}}
                        />
                      )}

                      {component.availableColors &&
                        component.availableColors.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              Available Colors:
                            </label>
                            <div className="flex gap-1 mt-1">
                              {component.availableColors.map((color, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1"
                                >
                                  {getColorPreview(color)}
                                  <span className="text-xs capitalize">
                                    {color}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          {/*<Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </label>
                  <p className="text-sm">{formatDate(customize.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">{formatDate(customize.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
            </Card>*/}
        </div>
      </DialogContent>
    </Dialog>
  );
}
