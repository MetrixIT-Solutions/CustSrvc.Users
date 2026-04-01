/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const apiServerStatus = () => {
  return {httpStatus: 200, status: '200', resData: {message: 'IndiFly365 - Customers Users API service is running'}};
}
const unKnownErr = (result) => {
  return {httpStatus: 500, status: '199', resData: {message: '500 - Unknown Error', result}};
}
const noData = (result) => {
  return {httpStatus: 400, status: '204', resData: {message: '204 - No Data Found', result}};
}
const tokenRequired = () => {
  return {httpStatus: 400, status: '192', resData: {message: 'Token is required'}};
}
const mandatory = () => {
  return {httpStatus: 400, status: '197', resData: {message: 'Provide required field(s) data'}};
}
const tokenInvalid = () => {
  return {httpStatus: 500, status: '191', resData: {message: 'Invalid Token'}};
}
const tokenExpired = () => {
  return {httpStatus: 400, status: '190', resData: {message: 'Token Expired'}};
}
const invalidAccess = () => {
  return {httpStatus: 400, status: '193', resData: {message: 'You do not have access'}};
}
const responseData = (result) => {
  return {httpStatus: 200, status: '200', resData: {message: 'Success', result}};
}

const invalidCredentials = (message) => {
  return {httpStatus: 400, status: '100', resData: {message}};
}
const accBlocked = () => {
  return {httpStatus: 400, status: '150', resData: {message: 'Your account is blocked, try after 1 hour'}};
}
const accHold = () => {
  return {httpStatus: 400, status: '151', resData: {message: 'Your account is on hold, try after 24 hours'}};
}
const accInactive = () => {
  return {httpStatus: 400, status: '152', resData: {message: 'Your account is inactive, contact management'}};
}
// const invalid = () => {
//   return {httpStatus: 400, status: '100', resData: {message: 'Invalid credentials'}};
// }

const updateFailed = () => {
  return {httpStatus: 400, status: '195', resData: {message: 'Update Failed'}};
}
const otpSentSuc = () => {
  return {httpStatus: 200, status: '200', resData: {message: 'OTP Sent'}};
}
const invalidOtp = () => {
  return {httpStatus: 400, status: '101', resData: {message: 'Provided Invalid OTP'}};
}
const otpVerify = (result) => {
  return {httpStatus: 400, status: '200', resData: {message: 'OTP Verified Successfully', result}};
}
const saveFailed = () => {
  return {httpStatus: 400, status: '196', resData: {message: 'Save Trx failed'}};
}

const otpTokenExpired = () => {
  return {httpStatus: 400, status: '204', resData: {message: 'Token Expired'}};
}

const deleteFailed = () => {
  return {httpStatus: 400, status: '194', resData: {message: 'Delete Failed'}};
}
const primaryExists = () => {
  return {httpStatus: 400, status: '198', resData: {message: 'Email Already Exists'}};
}
const errorMsg = () => {
  return {httpStatus: 400, status: '195', resData: {message: 'Current Password Is Wrong'}};
}

module.exports = {
  apiServerStatus, unKnownErr, noData, tokenRequired, mandatory, tokenInvalid, tokenExpired, invalidAccess,
  responseData, invalidCredentials, accBlocked, accHold, accInactive, updateFailed, otpSentSuc,
  invalidOtp, otpVerify, otpTokenExpired, saveFailed, deleteFailed, primaryExists, errorMsg
};
