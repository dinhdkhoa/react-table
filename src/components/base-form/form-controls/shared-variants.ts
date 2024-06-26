
import { cva, type VariantProps } from "class-variance-authority"

export const SharedVariants = cva(
    null,
    {
        variants: {
            variant: {
                default:
                    "",
            },
            labelVariant: {
                hidden: "hidden",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

export type SharedVariantProps = VariantProps<typeof SharedVariants>