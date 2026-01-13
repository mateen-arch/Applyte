import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Select Root - Context provider for value and onChange
const SelectContext = React.createContext({
  value: "",
  onValueChange: () => {},
})

const Select = ({ value, onValueChange, children, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(value || "")

  React.useEffect(() => {
    setInternalValue(value || "")
  }, [value])

  const handleValueChange = (newValue) => {
    setInternalValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <SelectContext.Provider value={{ value: internalValue, onValueChange: handleValueChange }}>
      {children}
    </SelectContext.Provider>
  )
}

// SelectGroup wrapper
const SelectGroup = ({ children, ...props }) => <div {...props}>{children}</div>

// SelectValue - placeholder display
const SelectValue = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

// SelectTrigger - the actual select element
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { value, onValueChange } = React.useContext(SelectContext)
  
  // Extract options from SelectContent
  const contentChild = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SelectContent
  )
  
  const items = contentChild
    ? React.Children.toArray(contentChild.props.children).filter(
        (child) => React.isValidElement(child) && child.type === SelectItem
      )
    : []

  return (
    <div className="relative">
      <select
        ref={ref}
        value={value || ""}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer pr-8",
          "dark:bg-input/30",
          className
        )}
        {...props}
      >
        {items.map((item, index) => (
          <option key={index} value={item.props.value}>
            {item.props.children}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  )
})
SelectTrigger.displayName = "SelectTrigger"

// SelectContent - wrapper that doesn't render but holds items
const SelectContent = ({ className, children, ...props }) => {
  // Return children so they can be extracted by SelectTrigger
  return <>{children}</>
}

// SelectLabel wrapper
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
SelectLabel.displayName = "SelectLabel"

// SelectItem - represents an option
const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  // Return a fragment so it can be extracted by SelectTrigger
  return <>{children}</>
})
SelectItem.displayName = "SelectItem"

// SelectSeparator
const SelectSeparator = ({ className, ...props }) => (
  <hr className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
)

// Unused components for compatibility
const SelectScrollUpButton = () => null
const SelectScrollDownButton = () => null

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
