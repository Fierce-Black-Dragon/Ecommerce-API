/// base stands for  mongooseModel.find
// base ex
// product.find({})
/// bigQuery stand for req.query
// bigQuery ex
// http://localhost:4001/api/v1/product?search=hplaptops&page=3&category=laptops&rating[gte]=4&limit=10

class WhereClause {
  constructor(base, bigQuery) {
    this.base = base;
    this.bigQuery = bigQuery;
  }

  //search
  search() {
    // destructing req.query(bigQuery)
    const searchElement = this.bigQuery.search
      ? {
          name: {
            $regex: this.bigQuery.search,
            options: "i",
          },
        }
      : {};
    this.base = this.base.find({ ...searchElement });
    return this;
  }

  //pagination
  pager(resultPerPage) {
    //initial page is 1
    let currentPageNo = 1;
    // checking  page no exist in query
    if (this.bigQuery.page) {
      //update current page with query page
      currentPageNo = this.bigQuery.page;
    }
    // formula to skip values per page
    const skipValue = resultPerPage * (currentPageNo - 1);
    //updating base
    this.base = this.base.limit(resultPerPage).skip(skipValue);
    return this;
  }
}
