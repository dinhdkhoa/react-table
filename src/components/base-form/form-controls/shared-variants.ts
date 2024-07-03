
import { cva, type VariantProps } from "class-variance-authority"

export const SharedVariants = cva(
    null,
    {
        variants: {
            formVariant: {
                default:
                    "",
            },
            showLabel: {
                hidden: "hidden",
            }
        },
        defaultVariants: {
            formVariant: "default"
        }
    }
)

export type SharedVariantProps = VariantProps<typeof SharedVariants>