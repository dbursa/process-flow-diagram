import { Dialog as DialogPrimitive } from 'bits-ui';
import DialogContent from './dialog-content.svelte';
import DialogHeader from './dialog-header.svelte';
import DialogTitle from './dialog-title.svelte';

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

export {
	DialogRoot as Dialog,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle
};
