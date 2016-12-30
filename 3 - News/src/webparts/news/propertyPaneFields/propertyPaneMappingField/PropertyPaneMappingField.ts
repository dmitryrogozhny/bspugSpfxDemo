import * as React from "react";
import * as ReactDom from 'react-dom';

import {IPropertyPaneField, IPropertyPaneFieldType, IPropertyPaneCustomFieldProps} from "@microsoft/sp-client-preview";
import {IPropertyPaneMappingFieldProps} from "./IPropertyPaneMappingField";

import PropertyPaneMappingFieldHost, {IPropertyPaneMappingFieldHostProps} from "./PropertyPaneMappingFieldHost";

interface IPropertyPaneMappingFieldPropsExtended extends IPropertyPaneCustomFieldProps, IPropertyPaneMappingFieldProps {
}

export function PropertyPaneMappingField(targetProperty: string, properties: IPropertyPaneMappingFieldProps): IPropertyPaneField<IPropertyPaneMappingFieldProps> {
  // const newProps: IPropertyPaneMappingFieldPropsExtended = {
  //   onRender: undefined,
  //   value: properties.value,
  //   onPropertyChange: properties.onPropertyChange
  // }

  const additionalProps: IPropertyPaneCustomFieldProps = {
    onRender: undefined
  };

  const extendedProps = {};

  Object.assign<any, IPropertyPaneMappingFieldProps, IPropertyPaneCustomFieldProps>(extendedProps, properties, additionalProps);

  return new PropertyPaneMappingFieldBuilder(targetProperty, extendedProps as IPropertyPaneMappingFieldPropsExtended);
}

class PropertyPaneMappingFieldBuilder implements IPropertyPaneField<IPropertyPaneMappingFieldPropsExtended> {
  public readonly type:IPropertyPaneFieldType = IPropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneMappingFieldPropsExtended;

  constructor(targetProperty: string, properties: IPropertyPaneMappingFieldPropsExtended) {
    this.targetProperty = targetProperty;
    this.properties = properties;

    this.properties.onRender = this.onRender;
  }

  private onChange = (newValue: string) => {
    this.properties.onPropertyChange(this.targetProperty, newValue);
  };

  public onRender = (element: HTMLElement) => {
    const reactElement: React.ReactElement<IPropertyPaneMappingFieldHostProps> = React.createElement(PropertyPaneMappingFieldHost, {
      label: this.properties.label,
      value: this.properties.value,
      onChange: this.onChange
    });

    ReactDom.render(reactElement, element);
  }
}