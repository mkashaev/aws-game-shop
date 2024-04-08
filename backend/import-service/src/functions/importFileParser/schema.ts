export type BodyType = {};
export type QueryType = {};

export type RecordType = {
  s3: {
    bucket: {
      name: string;
    };
    object: {
      key: string;
    };
  };
};
