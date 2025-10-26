import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@components/ui/shadcn/alert-dialog"
import { Button } from "@components/ui/shadcn/button"
import { Trash2 } from "lucide-react"

export function DeleteButton({
    id,
    onDelete,
}: {
    id: number
    onDelete: (id: number) => Promise<void>
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Точно?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Что удалено, вернуть не получится.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => id && onDelete(id)}>
                        Да, точно
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
