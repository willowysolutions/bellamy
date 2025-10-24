'use client';

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/server/actions/category-actions";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.instanceof(File).optional(),
});

interface CategoryDialogFormProps {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  category?: Category;
}

export const CategoryDialogForm: FC<CategoryDialogFormProps> = ({
  open: isOpen = false,
  onOpenChange,
  category,
}) => {
  const [open, setOpen] = useState(isOpen);
  const [preview, setPreview] = useState<string | null>(category?.image || null);
  const router = useRouter();

  const { execute: create, isExecuting: isCreating } = useAction(createCategoryAction);
  const { execute: updateCategory, isExecuting: isUpdating } = useAction(updateCategoryAction);

  useEffect(() => onOpenChange?.(open), [open, onOpenChange]);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.image) formData.append("image", values.image);

      if (!category) {
        if (!values.image) {
          toast.error("Image is required when adding a new category");
          return;
        }
        await create(formData);
        toast.success("Category added successfully");
      } else {
        formData.append("id", category.id);
        await updateCategory(formData);
        toast.success("Category updated successfully");
      }

      form.reset();
      setPreview(null);
      router.refresh();
      setOpen(false);
    } catch {
      toast.error("Failed to save category");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!category && (
        <DialogTrigger asChild>
          <Button variant="outline">Add Category</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit" : "Add"} Category</DialogTitle>
        </DialogHeader>
        <DialogDescription>Fill in the category details below.</DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>Image {!category && "*"}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...rest}
                      value={undefined} // file input cannot have value
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </FormControl>

                  {preview && (
                    <div className="mt-2 relative h-24 w-24 rounded-md border overflow-hidden">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Loading..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};