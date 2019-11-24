var express = require('express');
var moment = require('moment');
require("../DatabaseConnection/db"); 
var Records = require("../Records/RecordsDeclaration");

var Router = express.Router();


Router.post('/', function(req, res, next) {
  var { 
    //The request payload will include a JSON with fields
    //StartDate,EndDate,minCount and maxCount
     startDate, 
     endDate, 
     minCount, 
     maxCount
     } = req.body

  startDate = moment(startDate, "YYYY-MM-DD");
  endDate = moment(endDate, "YYYY-MM-DD");
  minCount = parseInt(minCount);
  maxCount = parseInt(maxCount);

  
  if (!startDate.isValid()  || !endDate.isValid() || isNaN(minCount) || isNaN(maxCount))
  //Validating the variables
  {
    return res.status(400).send({
      //If sends a 400 statu which give you a bad request as in below
      code: 400,
      msg: 'Invalid data (400), Bad Request !',
      records: []
    })
  }

  //DB aggregation
  Records.aggregate([
    
    //This is the place where we collect all elemetns of a count array 
    { $addFields: {
        totalCount: {//Adding the elements of the array into totalCount
          $reduce: {
            input: '$count',
            initialValue: 0,
            in: { $add: ['$$this', '$$value'] } 
          }
        }
      }
    },
   
    { $match: {
      createdAt: {
        $gte: startDate.toDate(),
        // $gte selects the document where the value of the field is greater than specified value.
        //(MongoDB Documentation)
        $lte: endDate.toDate()
        //$lte selects the document where the value of the field is less than specified value.
        //(MongoDB Documentation)
      },
      totalCount: {
        $gte: minCount,
        $lte: maxCount
      }
    }},

    { $project: {
      _id: 0, // In case of 0 do no put into the field
      key: 1, //In case of 1 put into the field
      createdAt: 1,
      totalCount: 1
    }}
  ])
  .exec((err, data) => {
    if (err) {
      // 500 status which is Server Error
      return res.status(500).send({
        code: 500,
        msg: 'Server Error: ' + err,
        records: []
      })
    }

    // In the case of successful
    res.status(200).send({
      code: 0,
      msg: 'Success',
      records: data
    });

  }); 

}); 

module.exports = Router;
