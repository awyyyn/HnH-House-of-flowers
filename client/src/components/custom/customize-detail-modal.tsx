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
  PackageIcon,
  PaletteIcon,
  FileTextIcon,
  Info,
  PhilippinePeso,
} from "lucide-react";
import { Customize } from "@/types";
import { RichTextEditor } from "./rich-text-editor";
import { defaultRichTextEditorValue } from "@/constants";

interface CustomizeDetailsModalProps {
  customize: Customize;
  trigger?: React.ReactNode;
}

export function CustomizeDetailsModal({
  customize,
  trigger,
}: CustomizeDetailsModalProps) {
  const getColorPreview = (color?: string) => {
    if (!color) return null;
    return (
      <div
        className="w-4 h-4 rounded-full border border-gray-300 inline-block mr-2"
        style={{ backgroundColor: `#${color.toLowerCase()}` }}
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
                    <PhilippinePeso className="w-3 h-3" />
                    {customize.totalPrice}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Wrapper Color
                  </label>
                  <p className="text-sm font-semibold">
                    {customize.wrapperColor || "Default Color"}
                  </p>
                </div>

                {!!customize.bill && (
                  <div className="col-span-2">
                    <h1 className=" text-sm font-medium">Money Bouquet</h1>
                    <div className="grid grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Bill
                        </label>
                        <p className="text-sm font-semibold">
                          {customize.bill}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Quantity
                        </label>
                        <p className="text-sm font-semibold">
                          {customize.billQuantity}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {customize.note === defaultRichTextEditorValue && (
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
                          {customize.product.price}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Components */}
          {customize.flowerComponents &&
            customize.flowerComponents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PaletteIcon className="w-4 h-4" />
                    Flower Components ({customize.flowerComponents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {customize.flowerComponents.map((flwr) => (
                      <div
                        key={flwr.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <img
                              src={
                                flwr.image ||
                                "https://blocks.astratic.com/img/general-img-landscape.png"
                              }
                              alt={flwr.name}
                              className="w-12 h-12 object-cover rounded-md  "
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://blocks.astratic.com/img/general-img-landscape.png";
                              }}
                            />

                            <div className="space-y-1">
                              <h4 className="font-semibold text-sm">
                                {flwr.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    flwr.isAvailable ? "default" : "destructive"
                                  }
                                >
                                  {flwr.isAvailable
                                    ? "Available"
                                    : "Out of Stock"}
                                </Badge>
                                <Badge variant="outline">{flwr.type}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm font-semibold">
                              {Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                              }).format(flwr.price || 0)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Pcs:{" "}
                              {(customize?.flowerComponentsQuantity || []).find(
                                (flr) => flr.id === flwr.id,
                              )?.quantity || 0}{" "}
                              pcs
                            </p>
                          </div>
                        </div>

                        {flwr.description && (
                          <RichTextEditor
                            content={flwr.description}
                            editable={false}
                            isEditing={false}
                            handleValue={() => {}}
                          />
                        )}

                        {/*{component.type === "WRAPPER" &&
                        component.availableColors &&
                        component.availableColors.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              Available Colors:
                            </label>ss
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
                        )}*/}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {customize.wrapperComponent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PaletteIcon className="w-4 h-4" />
                  Wrapper Component
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div
                    key={customize.wrapperComponent.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <img
                          src={
                            customize.wrapperComponent.image ||
                            "https://blocks.astratic.com/img/general-img-landscape.png"
                          }
                          alt={customize.wrapperComponent.name}
                          className="w-12 h-12 object-cover rounded-md  "
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://blocks.astratic.com/img/general-img-landscape.png";
                          }}
                        />

                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm">
                            {customize.wrapperComponent.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                customize.wrapperComponent.isAvailable
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {customize.wrapperComponent.isAvailable
                                ? "Available"
                                : "Out of Stock"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-semibold">
                          {Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(customize.wrapperComponent.price || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {customize.wrapperComponent.quantity}
                        </p>
                      </div>
                    </div>

                    {customize.wrapperComponent.description && (
                      <RichTextEditor
                        content={customize.wrapperComponent.description}
                        editable={false}
                        isEditing={false}
                        handleValue={() => {}}
                      />
                    )}

                    {/*{component.type === "WRAPPER" &&
                        component.availableColors &&
                        component.availableColors.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              Available Colors:
                            </label>ss
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
                        )}*/}
                  </div>
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
