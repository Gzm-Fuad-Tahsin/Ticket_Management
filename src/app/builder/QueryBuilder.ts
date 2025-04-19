import { FilterQuery, Query } from "mongoose";

import { isValidObjectId, Types } from 'mongoose';
import dayjs from 'dayjs';

class QueryBuilder<T>{
    public modelQuery : Query<T[],T>;
    public query : Record<string, unknown>;

    constructor(modelQuery : Query<T[],T> ,query : Record<string, unknown>){
        this.modelQuery = modelQuery;
        this.query = query;
    }



search(searchableFields: string[]) {
  const searchTerm = this.query?.searchTerm as string;
  const dateSearch = this.query?.dateSearch as string;
  const objectIdSearch = this.query?.objectIdSearch as string;

  const orConditions: FilterQuery<T>[] = [];

  // Handle string/number search
  if (searchTerm) {
    for (const field of searchableFields) {
      orConditions.push({
        [field]: { $regex: searchTerm, $options: 'i' },
      } as FilterQuery<T>);
    }
  }

  // Handle date search
  if (dateSearch) {
    const parsedDate = dayjs(dateSearch);
    if (parsedDate.isValid()) {
      orConditions.push({
        date: parsedDate.toISOString(),
      } as FilterQuery<T>);
    }
  }

  // Handle ObjectId search
  if (objectIdSearch && isValidObjectId(objectIdSearch)) {
    console.log(searchableFields)
    for (const field of searchableFields) {
      if (field !== 'date') {
      orConditions.push({
        [field]: new Types.ObjectId(objectIdSearch),
      } as FilterQuery<T>);
    }
  }
}
// console.log(orConditions)

  if (orConditions.length > 0) {
    this.modelQuery = this.modelQuery.find({  $or: orConditions });
  }

  return this;
}


    filter(){
        const queryObj =  {...this.query};
        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        Object.keys(queryObj).forEach((key) => {
            if (queryObj[key] === "") {
              delete queryObj[key];
            }
          });
      
        this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
        return this;

    }


    sort() {
        const sort = (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort as string);
        return this;
    }

    paginate() {
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    filed() {
        const fields = (this?.query?.sort as string)?.split(",")?.join(" ") || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    async countTotal() {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 10;
        const totalPage = Math.ceil(total / limit);
    
        return {
          page,
          limit,
          total,
          totalPage,
        };
      }

    

}


export default QueryBuilder;