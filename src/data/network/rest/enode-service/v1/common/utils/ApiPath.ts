export const ApiPath = (resource: string) =>
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${resource}`;
  