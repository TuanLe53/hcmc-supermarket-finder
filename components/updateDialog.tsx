"use client";

import { FormEvent, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";

import EditIcon from '@mui/icons-material/Edit';

interface DialogProps{
    updateField: string;
    action: (args: string) => void;
}

export default function UpdateDialog({ updateField, action }: DialogProps) {
    const [open, setOpen] = useState(false);
    console.log(updateField)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = formData.get(updateField);

        setOpen(false)
        action(data as string)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger><EditIcon /></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change your {updateField}</DialogTitle>
                    <DialogDescription>Add your new {updateField}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <Input
                            name={updateField}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose className="p-1 rounded-md bg-slate-200 hover:bg-slate-300">
                            Close
                        </DialogClose>    
                        <button
                            type="submit"
                            className="p-1 rounded-md bg-sky-400 hover:bg-sky-500"
                        >
                            Update
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}