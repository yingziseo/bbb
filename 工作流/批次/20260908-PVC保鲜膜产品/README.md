# PVC 保鲜膜产品发布记录

发布日期：2026-09-08。分类 ID：230。站点：https://yiyuanpack.com。

## 产品与图片

| 产品 | ID | 地址 | 主图素材 | 配图数 | 详情图数 |
|---|---|---|---|---|---|
| PVC Fresh Food Hand Wrap | 14 | https://yiyuanpack.com/products/pvc-fresh-food-hand-wrap | pic(2).jpg | 3 | 2 |
| PVC Catering Cling Film in Cutter Box | 15 | https://yiyuanpack.com/products/pvc-catering-cutter-box-film | pic(17).jpg | 5 | 2 |
| PVC Household Cling Film Refill Rolls | 16 | https://yiyuanpack.com/products/pvc-household-refill-rolls | pic(15).jpg | 4 | 2 |
| PVC Large Roll Cling Film | 17 | https://yiyuanpack.com/products/pvc-large-roll-cling-film | pic(13).jpg | 3 | 2 |

分类：https://yiyuanpack.com/products/category/pvc-cling-film

## 来源与录入边界

- 参考分类：https://www.centryplastic.com/products/PVCshengxianbaozhuangmo.html
- 参考详情：`/products_detail/1389299115354640384.html`、`/products_detail/1389299116969447424.html`、`/product/10.html`、`/product/17.html`（同域名）。
- 采用可核实的 PVC 材质、透明外观、产品形式与用途分类；按本网站英文采购页面撰写原创文案，未复制竞品品牌名称、联系方式、检测报告及无本品牌证据的抗菌/合规承诺。
- 参考文字未给出宽度、厚度、卷长、纸芯、MOQ 数值；参考详情图片服务器返回 403，因此相应字段为按订单/报价确认，不编造参数。
- `sizeOptions` 留空，避免发布虚构 SKU 尺寸组合；已有其他产品未修改。
- 使用 18 张保鲜膜原图（无生成、修图、裁切），主图完整展示。排除 `pic(4).jpg`、`pic(6).jpg` 至 `pic(10).jpg` 共 6 张餐具/杯子图。
- 用户素材中的包装标识保留原样，网站产品标题与文案使用通用品名及 YIYUAN。

## 素材映射

| 原素材 | 网站图片 | 用途描述 |
|---|---|---|
| pic(2).jpg | /uploads/pvc-cling-film-20260908/fresh-rolls.jpg | PVC cling film rolls with fresh vegetables |
| pic(1).jpg | /uploads/pvc-cling-film-20260908/hand-wrapping.jpg | Hand wrapping a strawberry plate with transparent PVC film |
| pic(3).jpg | /uploads/pvc-cling-film-20260908/roll-core.jpg | PVC film roll and paper core detail |
| pic(5).jpg | /uploads/pvc-cling-film-20260908/refill-rolls.jpg | Four PVC cling film refill rolls |
| pic(11).jpg | /uploads/pvc-cling-film-20260908/jumbo-standing.jpg | Large PVC cling film rolls in standing and horizontal positions |
| pic(13).jpg | /uploads/pvc-cling-film-20260908/jumbo-pair.jpg | Two large PVC cling film rolls |
| pic(14).jpg | /uploads/pvc-cling-film-20260908/jumbo-single.jpg | Single large PVC cling film roll with visible paper core |
| pic(15).jpg | /uploads/pvc-cling-film-20260908/slim-rolls.jpg | Slim PVC cling film rolls for manual wrapping |
| pic(16).jpg | /uploads/pvc-cling-film-20260908/packaging-food.jpg | Boxed cling film and a wrapped food tray |
| pic(17).jpg | /uploads/pvc-cling-film-20260908/cutter-box-fruit.jpg | Cling film cutter box with a fruit tray |
| pic(18).jpg | /uploads/pvc-cling-film-20260908/cutter-box-tray.jpg | Pulling cling film from a cutter box over a tray |
| pic(19).jpg | /uploads/pvc-cling-film-20260908/cutter-box-use.jpg | Manual dispensing from a cling film cutter box |
| pic(20).jpg | /uploads/pvc-cling-film-20260908/fresh-food-display.jpg | Cling film rolls with wrapped fresh food displays |
| pic(21).jpg | /uploads/pvc-cling-film-20260908/retail-rolls.jpg | Packaged cling film rolls displayed with vegetables |
| pic(22).jpg | /uploads/pvc-cling-film-20260908/wrapped-roll.jpg | Individually wrapped cling film roll |
| pic(23).jpg | /uploads/pvc-cling-film-20260908/retail-boxes.jpg | Cling film roll and retail box packaging examples |
| pic(24).jpg | /uploads/pvc-cling-film-20260908/box-range.jpg | Assorted cling film cutter box packaging |
| pic.jpg | /uploads/pvc-cling-film-20260908/bowl-cover.jpg | Transparent cling film covering a bowl of vegetables |

## 备份与发布

- SQLite 在线备份：`data/backups/before-pvc-products-20260908-154247.db`。
- 先通过后台 API 创建草稿，校验配图与详情保存，再发布 4 条；`published.json` 保留 API 返回记录，`products.json` 保留文案与输入数据。
- 生产使用 GitHub Actions 构建产物，经 SHA256 和 commit SHA 校验后部署；不在服务器构建。
- 18 张公网图片均为 HTTP 200；SQLite integrity_check 为 ok；最终页面与交互验证见开发日志。
