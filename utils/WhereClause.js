/// base stands for  mongooseModel.find
// base ex
// product.find({})
/// bigQuery stand for req.query
// bigQuery ex
// http://localhost:4001/api/v1/product?search=ddderrr&page=3&category=62120a1a60f62967c20504f2&rating[gte]=4&limit=10

class WhereClause {
  constructor(base, bigQuery) {
    this.base = base;
    this.bigQuery = bigQuery;
  }

  //search  func
  search() {
    // destructing req.query(bigQuery)
    const searchElement = this.bigQuery.search
      ? {
          name: {
            $regex: this.bigQuery.search,
          },
        }
      : {};

    this.base = this.base.find({
      ...searchElement,
      $caseSensitive: false,
      $diacriticSensitive: false,
    });
    console.log(this.base);
    return this;
  }
  //filter func
  filter() {
    const copyQ = { ...this.bigQ };
    // deleting search, limit and page
    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];

    //convert copyQ (bigQ )into a string
    let stringOfCopyQ = JSON.stringify(copyQ);
    //replacing gte and lte to $gte and $ lte
    stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte)\b/g, (m) => `$${m}`);
    //  converting  stringOfCopyQ to json object
    const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
    // passing jsonCopyQ to base.find
    this.base = this.base.find(jsonOfCopyQ);
    return this;
  }

  //pagination  func
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
module.exports = WhereClause;
