import HeroCarousel from "@/app/user/components/carousel";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { StoreImage } from "@/types";
import * as React from "react";

interface PreviewThemeProps {
  images: StoreImage["image"];
}

const PreviewTheme: React.FC<PreviewThemeProps> = ({ images }) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Preview</Button>
        </DialogTrigger>
        <DialogContent className="md:min-w-[80dvw]">
          <DialogHeader>
            <DialogTitle>Preview theme</DialogTitle>
          </DialogHeader>
          <div>
            <HeroCarousel images={images} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default PreviewTheme;
