import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-client-preview';

import * as strings from 'unsplashImageStrings';
import UnsplashImage, { IUnsplashImageProps } from './components/UnsplashImage';
import { IUnsplashImageWebPartProps } from './IUnsplashImageWebPartProps';

/**
 * Shows an image from the unsplash.com site.
 *
 * @export
 * @class UnsplashImageWebPart
 * @extends {BaseClientSideWebPart<IUnsplashImageWebPartProps>}
 */
export default class UnsplashImageWebPart extends BaseClientSideWebPart<IUnsplashImageWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  /**
   * Saves the changed category and image url to the web part's properties.
   *
   * @protected
   *
   * @memberOf UnsplashImageWebPart
   */
  protected onImageChange = (imageCategory: string, imageUrl: string) => {
    this.onPropertyChange("imageCategory", imageCategory);
    this.onPropertyChange("imageUrl", imageUrl);
  }

  public render(): void {
    const element: React.ReactElement<IUnsplashImageProps> = React.createElement(UnsplashImage, {
      alternateText: this.properties.alternateText,
      caption: this.properties.caption,
      imageUrl: this.properties.imageUrl,
      imageCategory: this.properties.imageCategory,

      httpClient: this.context.basicHttpClient,
      displayMode: this.displayMode,
      onImageChange: this.onImageChange
    });

    ReactDom.render(element, this.domElement);
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
              groupFields: [
                PropertyPaneTextField('alternateText', {
                  label: strings.AlternateTextFieldLabel
                }),
                PropertyPaneTextField('caption', {
                  label: strings.CaptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
