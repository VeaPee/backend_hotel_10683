const httpStatus = require('http-status');
const Response = require('../model/Response');
const prisma = require('../prisma/client');
const customerValidator = require("../utils/customerValidator");

const getCustomer = async (req, res) => {
  let response = null;
  const getCustomerMessage = 'Data Customer berhasil diterima';

  try {
    const accountId = req.currentUser.id;

    if (accountId === null) {
      response = new Response.Error(true, 'accountId is required');
      res.status(httpStatus.OK).json(response);
      return;
    }
    
    const customer = await prisma.customer.findMany({
      where: {
        akunId: parseInt(accountId),
      },
    });

    if(customer.length === 0) {
      const response = new Response.Error(true, "error", 'Data Kosong');
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    response = new Response.Success(false, "success", getCustomerMessage, customer);
    res.status(httpStatus.OK).json(response);

  } catch (error) {
    const response = new Response.Error(true,"error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }

}

const getCustomerByID = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!customer) {
      const response = new Response.Error(true, "error","Data Customer Tidak Ada");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const response = new Response.Success(false, "success", "success", { customer });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error",error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const addCustomer = async (req, res) => {
  let response = null;
  try {
    const accountId = req.currentUser.id;
    const accountRole = req.currentUser.roleId;

    //Check Customer
    const customerCheck = await prisma.customer.findFirst({
      where: {
        akunId: parseInt(accountId),
      }
    });
    
    if(accountRole === 6){
      if(customerCheck) {
        const response = new Response.Error(true, "error",'Data Customer hanya boleh 1');
        res.status(httpStatus.BAD_REQUEST).json(response);
        return;
      }
      req.body.jenis_customer = "personal";
    }else if(accountRole === 2){
      req.body.jenis_customer = "grup";
    }else{
        const response = new Response.Error(true, "error",'Tidak diperbolehkan menambah Data');
        res.status(httpStatus.OK).json(response);
        return;
    }

    //Body Request
    req.body.akunId = parseInt(accountId);
  

    const addCustomer = await customerValidator.validateAsync(req.body);

    if (!accountId) {
      response = new Response.Error(true, "error",'accountId is required');
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const customer = await prisma.customer.create({
      data: addCustomer
    })

    response = new Response.Success(false, "success",'Customer berhasil dibuat', customer);
    res.status(httpStatus.OK).json(response);

  } catch (error) {
    response = new Response.Error(true, "error",error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
}

const updateCustomer = async (req, res) => {
  let response = null;
  
  try{
    const accountId = req.currentUser.id;
    const accountRole = req.currentUser.roleId;
    const id = req.params.id
    
    if(accountRole === 6){
      req.body.jenis_customer = "Personal";
    }else if(accountRole === 2){
      req.body.jenis_customer = "Grup";
    }

    req.body.akunId = parseInt(accountId);
    const updatedCustomer = await customerValidator.validateAsync(req.body);

    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if(!customer) {
      const response = new Response.Error(true, "error",'Data Customer Tidak Ada');
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    //Checking Account
    if(accountId != customer.akunId){
      const response = new Response.Error(true, "error",'Tidak bisa update data');
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const updated = await prisma.customer.update({
      where: {
        id: parseInt(id)
      },
  
      data: updatedCustomer
    })

    response = new Response.Success(false, "success",'Customer berhasil diperbarui', updated);
    res.status(httpStatus.OK).json(response);
  } catch(error) {
    response = new Response.Error(true, "error",error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }

}

//Riwayat Reservasi

const getRiwayatTransaksi = async (req, res) => {
  let response = null;
  const getRiwayatMessage = 'Data Riwayat berhasil diterima';

  try {
    const accountId = req.currentUser.id;
  
    const customer = await prisma.customer.findFirst({
      where: {
        akunId: parseInt(accountId)
      }
    })

    if(!customer) {
      const response = new Response.Error(true, "error",'Data Customer Tidak Ada');
      res.status(httpStatus.OK).json(response);
      return;
    }
  
    const customerId = customer.id
  
    const riwayatTransaksi = await prisma.reservasi.findMany({
      where: {
        customerId: customerId
      },
      include: {
        NotaPelunasan: true,
        DetailReservasiKamar: true,
        DetailReservasiFasilitas: true
      }
    })
  
    response = new Response.Success(false, "success", getRiwayatMessage, riwayatTransaksi);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
}

const getDetailRiwayatTransaksi = async (req, res) => {
  let response = null;
  const getRiwayatMessage = 'Data Riwayat berhasil diterima';

  try {
    const idReservasi = req.params.id

    const detailRiwayatTransaksi = await prisma.reservasi.findFirst({
      where: {
        id: parseInt(idReservasi)
      },
      include: {
        NotaPelunasan: true,
        DetailReservasiKamar: true,
        DetailReservasiFasilitas: true
      }
    })

    if(!detailRiwayatTransaksi) {
      const response = new Response.Error(true, "error", 'Data Riwayat Transaksi Tidak Ada');
      res.status(httpStatus.OK).json(response);
      return;
    }

    response = new Response.Success(false, "success", getRiwayatMessage, detailRiwayatTransaksi);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error",error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
}
module.exports = {
  getCustomer,
  getCustomerByID,
  addCustomer,
  updateCustomer,
  getRiwayatTransaksi,
  getDetailRiwayatTransaksi
}