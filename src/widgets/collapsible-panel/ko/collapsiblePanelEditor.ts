import * as ko from "knockout";
import * as Utils from "@paperbits/common/utils";
import * as Objects from "@paperbits/common/objects";
import template from "./collapsiblePanelEditor.html";
import { CollapsiblePanelModel } from "../collapsiblePanelModel";
import { Component, OnMounted, Param, Event, OnDestroyed } from "@paperbits/common/ko/decorators";
import { ContainerStylePluginConfig, BackgroundStylePluginConfig, SizeStylePluginConfig } from "@paperbits/styles/contracts";
import { ViewManager } from "@paperbits/common/ui";
import { EventManager, CommonEvents } from "@paperbits/common/events";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";

@Component({
    selector: "amp-collapsible-panel-editor",
    template: template
})
export class CollapsiblePanelEditor {
    public readonly containerConfig: ko.Observable<ContainerStylePluginConfig>;
    public readonly backgroundConfig: ko.Observable<BackgroundStylePluginConfig>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.backgroundConfig = ko.observable<BackgroundStylePluginConfig>();
        this.containerConfig = ko.observable<ContainerStylePluginConfig>();
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();
    }

    @Param()
    public model: CollapsiblePanelModel;

    @Event()
    public onChange: (model: CollapsiblePanelModel) => void;

    @OnMounted()
    public initialize(): void {
        this.updateObservables();
        this.sizeConfig.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.eventManager.addEventListener(CommonEvents.onViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        const localStyle = this.model.styles?.instance;

        if (!localStyle) {
            Objects.setValue(`styles/instance/key`, this.model, Utils.randomClassName());
        }

        const containerConfig = Objects.getObjectAt<ContainerStylePluginConfig>(`instance/container/${viewport}`, this.model.styles);
        this.containerConfig(containerConfig);

        const backgroundConfig = Objects.getObjectAt<BackgroundStylePluginConfig>(`instance/background/${viewport}`, this.model.styles);
        this.backgroundConfig(backgroundConfig);

        const containerSizeStyles = Objects.getObjectAt<SizeStylePluginConfig>(`instance/size/${viewport}`, this.model.styles);
        this.sizeConfig(containerSizeStyles);
    }

    public onContainerUpdate(config: ContainerStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        Objects.setValue(`styles/instance/container/${viewport}`, this.model, config);
        this.onChange(this.model);
        this.containerConfig(config);
    }

    public onBackgroundUpdate(config: BackgroundStylePluginConfig): void {
        const viewport = this.viewManager.getViewport();
        Objects.setValue(`styles/instance/background/${viewport}`, this.model, config);
        this.onChange(this.model);
        this.backgroundConfig(config);
    }

    public applyChanges(): void {
        const viewport = this.viewManager.getViewport();
        this.model.styles = this.model.styles || {};

        const containerSizeStyles: SizeStylePluginConfig = this.sizeConfig();
        Objects.setValue(`instance/size/${viewport}`, this.model.styles, containerSizeStyles);

        this.onChange(this.model);
    }

    public onSizeUpdate(sizeConfig: SizeStylePluginConfig): void {
        this.sizeConfig(sizeConfig);
    }

    @OnDestroyed()
    public dispose(): void {
        this.eventManager.removeEventListener(CommonEvents.onViewportChange, this.initialize);
    }
}