import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "@/components";
import { toast } from "@/hooks/use-toast";
import {
  DELETE_STORE_IMAGE_MUTATION,
  READ_STORE_IMAGES_QUERY,
} from "@/queries";
import { StoreImage } from "@/types";
import { useMutation } from "@apollo/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteDialogThemeProps {
  storeImage: StoreImage;
}

export function DeleteDialogTheme({ storeImage }: DeleteDialogThemeProps) {
  const [deleteTheme, { loading }] = useMutation(DELETE_STORE_IMAGE_MUTATION);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTheme({
        variables: { id: storeImage.id },
        refetchQueries: [READ_STORE_IMAGES_QUERY],
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          (error as Error).message || "There was an error deleting the theme.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Theme</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this theme? This action is
            irreversible
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            disabled={loading}
            onClick={() => setOpen(false)}
            asChild
          >
            <Button variant="destructive">Cancel</Button>
          </DialogClose>
          <Button disabled={loading} onClick={handleDelete} variant="outline">
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
