import BaseModel from './';

export default class Asset extends BaseModel {

  constructor(data) {
    super(data);
  }

  get URL() {
    return this.data.attributes.URL;
  }

  get contentType() {
    return this.data.attributes.contentType;
  }

  get createdAt() {
    return this.data.attributes.createdAt;
  }

  get description() {
    return this.data.attributes.description;
  }

  get filename() {
    return this.data.attributes.filename;
  }

  get name() {
    return this.data.attributes.name;
  }

}
