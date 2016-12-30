import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneLabel
} from '@microsoft/sp-client-preview';

import * as strings from 'newsStrings';
import News, { INewsProps } from './components/News';
import { INewsWebPartProps } from './INewsWebPartProps';

import { PropertyPaneMappingField } from "./propertyPaneFields/propertyPaneMappingField/PropertyPaneMappingField";

export default class NewsWebPart extends BaseClientSideWebPart<INewsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INewsProps> = React.createElement(News, {
      newsLibraryName: this.properties.newsLibraryName,
      selectProperties: this.properties.selectProperties,
      contentType: this.properties.contentType,
      numberOfArticlesToShow: this.properties.numberOfArticlesToShow
    });

    ReactDom.render(element, this.domElement);
  }

  private onCustomPropertyChange = (propertyPath: string, newValue: any) => {
    this.onPropertyChange(propertyPath, newValue);
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('newsLibraryName', { label: strings.NewsLibraryNameFieldLabel }),
                PropertyPaneSlider('numberOfArticlesToShow', {
                  label: strings.NumberOfArticlesToShowFieldLabel,
                  value: this.properties.numberOfArticlesToShow,
                  min: 1,
                  max: 10
                }),
                PropertyPaneMappingField('selectProperties', {
                  label: strings.SelectPropertiesFieldLabel,
                  value: this.properties.selectProperties,
                  onPropertyChange: this.onCustomPropertyChange
                }),
                PropertyPaneLabel('contentType', { text: `${strings.ContentTypeFieldLabel}: ${this.properties.contentType}` }),
              ]
            }
          ]
        }
      ]
    };
  }

  
}