import { IHyperlinkProvider } from "@paperbits/common/ui";
import { HyperlinkModel } from "@paperbits/common/permalinks";


export class AmpPageHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "AMP Pages";
    public readonly componentName: string = "amp-page-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-lightning";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("amp-pages/");
    }

    public getHyperlinkFromResource(hyperlinkModel: HyperlinkModel): HyperlinkModel {
        return hyperlinkModel;
    }
}