import * as React from "react";
import {TextField} from "office-ui-fabric-react/lib/TextField";
import {Label} from "office-ui-fabric-react/lib/Label";

export interface IPropertyPaneMappingFieldHostProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

class PropertyPaneMappingFieldHost extends React.Component<IPropertyPaneMappingFieldHostProps, {}> {

  private onPropertyChange = (propertyName: string) => {
    return (newPropertyValue: string) => {
      const mappings = this.getMappings(this.props.value);

      mappings.forEach((mapping) => {
        if (mapping.key === propertyName) {
          mapping.value = newPropertyValue;
        }
      });

      let newValue = "";

      mappings.forEach((mapping, index) => {
        newValue += `${mapping.key}:${mapping.value}`;

        if (index < mappings.length - 1) {
          newValue += ",";
        }
      });

      console.log(newValue);
      this.props.onChange(newValue);
    };
  };

  private onGetErrorMessage = (value: string) => {
    return (value.trim().length > 0) ? ("") : ("Property cannot be empty.");
  };

  private getMappings: (string) => Array<{key: string, value: string}> = (value: string) => {
    const mapping: Array<{key: string, value: string}> = value.split(",")
      .filter((key) => {return (key.trim() !== "") ? true : false;})
      .map((key) => {
        const mappingPair: string[] = key.split(":");

        return {key: mappingPair[0], value: mappingPair[1]};
      });

    return mapping;
  };

  public render(): JSX.Element {
    const mappings = this.getMappings(this.props.value);
    const mappingInputs = mappings.map((mapping) => {
      return <TextField type="text" label={mapping.key} value={mapping.value} onChanged={this.onPropertyChange(mapping.key)} onGetErrorMessage={this.onGetErrorMessage} required={true} key={mapping.key}/>;
    });

    return (
      <span>
        <Label>{this.props.label}</Label>
        {mappingInputs}
      </span>
      );
  }
}

export default PropertyPaneMappingFieldHost;
