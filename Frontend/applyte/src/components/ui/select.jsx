import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Select Root - Context provider for value and onChange
const SelectContext = React.createContext({
  value: "",
  onValueChange: () => { },
  items: [],
})

const Select = ({ value, onValueChange, children, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(value || "")
  const [items, setItems] = React.useState([])

  React.useEffect(() => {
    setInternalValue(value || "")
  }, [value])

  // Extract items from children to handle sibling structure (Select -> SelectTrigger + SelectContent)
  React.useEffect(() => {
    const contentChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === SelectContent
    )

    if (contentChild) {
      const extractedItems = React.Children.toArray(contentChild.props.children)
        .filter((child) => React.isValidElement(child) && child.type === SelectItem)
        .map(child => ({
          value: child.props.value,
          label: child.props.children
        }))
      setItems(extractedItems)
    }
  }, [children])

  const handleValueChange = (newValue) => {
    setInternalValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <SelectContext.Provider value={{ value: internalValue, onValueChange: handleValueChange, items }}>
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
  const { value, onValueChange, items } = React.useContext(SelectContext)

  return (
    <div className="relative group">
      <select
        ref={ref}
        value={value || ""}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer pr-10 transition-all duration-200 hover:border-neutral-600 text-white",
          className
        )}
        {...props}
      >
        <option value="" disabled className="bg-neutral-900 text-gray-500">Select an option</option>
        {items.map((item, index) => (
          <option key={index} value={item.value} className="bg-neutral-900 text-white py-2">
            {item.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-200 group-hover:text-white" />
    </div>
  )
})
SelectTrigger.displayName = "SelectTrigger"

// SelectContent - wrapper that doesn't render but holds items
const SelectContent = ({ className, children, ...props }) => {
  // Return null so it doesn't render in the DOM, but its props are still accessible via React.Children in Select
  return null
}

// SelectLabel wrapper
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
SelectLabel.displayName = "SelectLabel"

// SelectItem - represents an option
const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  // Return a fragment so it can be extracted by Select
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
