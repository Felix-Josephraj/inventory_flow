import { returnReverse } from "./utils"


describe( "utils" , ()=>{
 it( "should reverse the array",()=>{
   const input = [1,1,2,3,4,5]
   const expected = [5,4,3,2,1,1]
   expect(returnReverse(input)).toEqual(expected)
 })
})