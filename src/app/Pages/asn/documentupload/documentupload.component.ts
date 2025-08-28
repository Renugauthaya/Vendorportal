import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../../../API/services.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from "xlsx";
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../../MaterialModule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

export const ShowColumn =
  [

    // {
    //   Column: 'S.No',
    //   type: 'S.NO',
    //   Description: 'S.No',
    //   visible: true,
    //   readonly: false,
    // },
    {
      Column: 'Action',
      type: 'Action',
      Description: 'Action',
      visible: true,
      readonly: false,
    },
    {
      Column: 'CardCode',
      type: 'Text',
      Description: 'Vendor Code',
      visible: true,
      readonly: true,
    },
    {
      Column: 'CardName',
      type: 'Text',
      Description: 'Vendor Name',
      visible: true,
      readonly: true,
    },
    {
      Column: 'ASNReqNum',
      type: 'Text',
      Description: 'ASN Request No',
      visible: true,
      readonly: true,
    }
    ,
    {
      Column: 'ASN',
      type: 'Text',
      Description: 'ASN',
      visible: true,
      readonly: true,
    },
    {
      Column: 'PoNum',
      type: 'Text',
      Description: 'Purchase Order',
      visible: true,
      readonly: true,
    },
    
     {
      Column: 'DeliveryDate',
      type: 'Text',
      Description: 'Delivery Date',
      visible: true,
      readonly: true,
    }


  ]
export const ShowColumn1 =
  [


    // {
    //   Column: 'S.No',
    //   type: 'S.NO',
    //   Description: 'S.No',
    //   visible: true,
    //   readonly: false,
    // },
    {
      Column: 'ASNReqNum',
      type: 'Text',
      Description: 'ASn Request ID',
      visible: true,
      readonly: true,
    },
    
    {
      Column: 'DocumentName',
      type: 'Text',
      Description: 'Document Name',
      visible: true,
      readonly: true,
    },
    {
      Column: 'Type',
      type: 'Text',
      Description: 'Type',
      visible: true,
      readonly: true,
    },

    {
      Column: 'UploadedOn',
      type: 'Text',
      Description: 'Uploaded On',
      visible: true,
      readonly: true,
    },

    {
      Column: 'Action',
      type: 'Text',
      Description: 'Action',
    },
   
    {
      Column: 'QRCode',
      type: 'Text',
      Description: 'QR Code',
    }
    ,
  ]


@Component({
  selector: 'app-documentupload',
  standalone: true,
  imports: [MaterialModule, CommonModule,
      FormsModule,
      NgSelectModule],
  templateUrl: './documentupload.component.html',
  styleUrl: './documentupload.component.scss'
})
export class DocumentuploadComponent {

@ViewChild('MatPaginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  vendor: any = []
  SPName: any = 'INUR_GetASNApprovalDatas'
  UserType: any;
  SerialNo: any = 0;
  date = new Date();
  Filter: any = {
    fromdate: '',
    todate: ''
  };
  HeaderTable: any = 'INUR_ASNR';
  TransType: any = 'T'
  linearray2: Array<any> = [];
  DetailData: any = [{}];
  DetailData1: any = [{}];
  getLoginDetails: any;
  expandedElement: any | null = null;
  newTableDataSource!: MatTableDataSource<any>;
  innerTableDataSource!: MatTableDataSource<any>;
  displayedColumns1: string[] = [];
  innerTableColumns: string[] = [];
  constructor(
    private dataService: ServicesService,
    private spinner: NgxSpinnerService,
    private toastr: NgToastService,

  ) {

    this.newTableDataSource = new MatTableDataSource<any>([{}]);
    this.innerTableDataSource = new MatTableDataSource<any>([{}]);
  }


    ngOnInit(): void {
      var loginDetails: any = localStorage.getItem("LoginDetails");
      this.getLoginDetails = JSON.parse(loginDetails);
      this.vendor = this.getLoginDetails.EmployeeCode;
      this.UserType = this.getLoginDetails.LoginType;
      this.Filter.fromdate = (JSON.stringify(new Date(this.date.getFullYear(), this.date.getMonth(), 2))).slice(1, 11);
      this.Filter.todate = (JSON.stringify(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1))).slice(1, 11);
      this.DetailData = ShowColumn;
      this.DetailData1 = ShowColumn1;
      this.displayedColumns1 = ShowColumn.map((Col => Col.Column))
      this.innerTableColumns = ShowColumn1.map((Col => Col.Column))
       this.getASNDocumentUploadList()
    }
  
    
  getASNDocumentUploadList() {
    this.spinner.show();
    var post = {
      vendor: this.vendor,
      fromdate: this.Filter.fromdate,
      todate: this.Filter.todate,
      UserType: this.UserType

    }
    let Parameter: any = JSON.stringify(post)

    this.dataService.ASNApprovaldata(this.SPName, Parameter).subscribe((res) => {
      debugger
      if (res.success == true) {
        this.spinner.hide();
        let data = res.data
        console.log(data)
        this.linearray2 = data.flatMap((item: { InnerData: string; }) => JSON.parse(item.InnerData));
        this.newTableDataSource = new MatTableDataSource<any>(data)
        this.innerTableDataSource = new MatTableDataSource<any>(this.linearray2)
      }
      else {
        this.spinner.hide();
        this.toastr.danger("error", res.data[0].message);
      }

    })

  }


  toggleRow(element: any) {
    debugger
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.linearray2.length == 0) {
      let numRows = !!this.innerTableDataSource.data.length ? this.innerTableDataSource.data.length : 0;
      this.linearray2.push({
        CreatedBy: this.getLoginDetails.UserName
      });
    }
    else if (this.linearray2.length > 0) {
      let filterdt = this.linearray2.filter((D: any) => {
        return D.ASNReqNum == this.expandedElement.ASNReqNum
      })
      if (filterdt.length == 0) {
        let numRows = !!this.innerTableDataSource.data.length ? this.innerTableDataSource.data.length : 0;
        this.linearray2.push({
          CreatedBy: this.getLoginDetails.UserName

        });
      }
    }
    let filterdt1 = this.linearray2.filter((D: any) => {
      return D.ASNReqNum == this.expandedElement.ASNReqNum
    })

    this.innerTableDataSource.data = filterdt1
  }


  Clear() {
    this.linearray2 = [];
    this.getASNDocumentUploadList()
  }

  
    applyFilter(event: any) {
      let filterValue = event.target.value;
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.newTableDataSource.filter = filterValue;
    }
  
    exportexcel(): void {
      debugger
      var table: any[] = [];
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.newTableDataSource.filteredData);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-GB').replace(/[/:, ]/g, '-');
      var FileName = 'ASN Approval Details ' + '-' + formattedDateTime + '.xlsx'
      XLSX.writeFile(wb, FileName);
    }
}
