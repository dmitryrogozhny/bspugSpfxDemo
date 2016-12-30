export interface IPropertyPaneMappingFieldProps {
  label: string;
  value: string;
  onPropertyChange: (propertyPath: string, newValue: any) => void;
}