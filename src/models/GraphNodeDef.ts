export class GraphNodeDef<TId> {
  constructor(
    public name: string,
    public id: TId,
    public childrenIds: TId[] = []
  ) {}
}
