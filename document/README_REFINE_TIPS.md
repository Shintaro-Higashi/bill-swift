# Refine Tips


### 独自のAPIを実行したい場合

CRUD 基本パターンのAPIの場合
```typescript
const { data } = await dataProvider(API_URL).getList({
    resource: "logs",
    filters: [
        {
            field: "resource",
            operator: "eq",
            value: resource,
        },
        {
            field: "meta.id",
            operator: "eq",
            value: meta?.id,
        },
    ],
});
```

基本パターンに該当しない場合
```typescript
import { useApiUrl, useCustom } from "@refinedev/core";

const API_URL = useApiUrl("metrics"); // multi dataProvider利用時
const { data: dailyRevenue } = useCustom({
  url: `${API_URL}/xxx`,
  method: "get",
  config: {
    query,
  },
});
```