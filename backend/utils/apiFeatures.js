
 class ApiFeateure{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    //search keywords
    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }:{};
        this.query=this.query.find({...keyword});
        return this;
    }

  //  filter categories
    filter(){
        const queryStrCopy = {...this.queryStr};
        const removeFileds =["keyword","page","limit"];
        removeFileds.forEach((key)=>delete queryStrCopy[key]);

        // this.query=this.query.find(queryStrCopy);        

        // const categorey=queryStrCopy.category;
        // this.query=this.query.find({category:categorey});


        //price filter
        let queryCopy = JSON.stringify(queryStrCopy);
        queryCopy = queryCopy.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        this.query=this.query.find(JSON.parse(queryCopy));
        return this;
    }

    //pagination
    pagination(itemsPerPage){
        const curPage=Number(this.queryStr.page)||1;
        const skip = itemsPerPage*(curPage-1);
        this.query=this.query.limit(itemsPerPage).skip(skip);
        return this;
    }
 };

 module.exports = ApiFeateure;