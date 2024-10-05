export type ArgumentTypes<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

export type RestoreModelInputType = {
  image: string;
  upscale?: number;
  face_upsample?: boolean;
  background_enhance?: boolean;
  codeformer_fidelity?: number;
};
