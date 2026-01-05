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
    onDelete,
    isOpen,
    onOpenChange,
}: {
    onDelete: () => Promise<void>
    isOpen?: boolean
    onOpenChange?: (value: React.SetStateAction<boolean>) => void
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            {!onOpenChange && (
                <AlertDialogTrigger asChild>
                    <Button>
                        <Trash2 />
                    </Button>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Точно?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Что удалено, назад не вернуть!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Подумать еще...</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                        Да, точно!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
