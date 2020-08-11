export interface Action {
    data: ActionData[];
    pluginId: string;
    actionId: string;
    type: string;
    instanceId?: string;
}

export interface ActionData {
    id: string;
    value: string;
}