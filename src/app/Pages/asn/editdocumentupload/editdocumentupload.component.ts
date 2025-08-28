import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../MaterialModule';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../../../API/services.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from "xlsx";
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

export const ShowColumn1 =
  [

    {
      Column: 'LineID',
      type: 'S.NO',
      Description: 'S.No',
      visible: true,
      readonly: false,
    },
    {
      Column: 'ASNNo',
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
      Column: 'FileName',
      type: 'Text',
      Description: 'File Name',
      visible: true,
      readonly: true,
    },
    {
      Column: 'ExtensionType',
      type: 'Text',
      Description: ' File Type',
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
      Column: 'Remarks',
      type: 'Text',
      Description: 'Description',
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
  selector: 'app-editdocumentupload',
  standalone: true,
  imports: [MaterialModule, CommonModule,
    FormsModule,
    NgSelectModule,],
  templateUrl: './editdocumentupload.component.html',
  styleUrl: './editdocumentupload.component.scss'
})
export class EditdocumentuploadComponent {
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
  documentData = {
    ASNReqNum: '',
    ASNNo: '',
    CardCode: '',
    CardName: '',
    documentType: '',
    documentName: '',
    description: '',
    attachment: ''
  };
  HeaderTable: any = 'INUR_ASND';
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
  selectedValue: string = '';
  searchText: string = '';
  myfilename: Array<any> = [];
  options: string[] = ['EInvoice', 'EwayBill', 'Invoice', 'Test Certificate', 'Qc Certificate'];
  formattedDateTime: string | null = null;
  currentIndex = 1;
  element: any;
  constructor(
    private dataService: ServicesService,
    private spinner: NgxSpinnerService,
    private toastr: NgToastService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private router: Router

  ) {

    this.newTableDataSource = new MatTableDataSource<any>([{}]);
    this.innerTableDataSource = new MatTableDataSource<any>([{}]);
    const nav = this.router.getCurrentNavigation();
    this.element = nav?.extras?.state?.['element'];  // 👈 receive element
    console.log(this.element);
  }


  ngOnInit(): void {
    var loginDetails: any = localStorage.getItem("LoginDetails");
    this.getLoginDetails = JSON.parse(loginDetails);
    this.vendor = this.getLoginDetails.EmployeeCode;
    this.UserType = this.getLoginDetails.LoginType;
    this.Filter.fromdate = (JSON.stringify(new Date(this.date.getFullYear(), this.date.getMonth(), 2))).slice(1, 11);
    this.Filter.todate = (JSON.stringify(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1))).slice(1, 11);
    // this.DetailData = ShowColumn;
    // this.DetailData1 = ShowColumn1;
    // this.displayedColumns1 = ShowColumn.map((Col => Col.Column))
    this.innerTableColumns = ShowColumn1.map((Col => Col.Column))
    debugger
    this.documentData.ASNNo = this.element.ASNNo
    this.documentData.CardCode = this.element.CardCode
    this.documentData.CardName = this.element.CardName
    this.linearray2 = this.element.InnerData ? JSON.parse(this.element.InnerData) : []
    this.innerTableDataSource = new MatTableDataSource<any>(this.linearray2)
    // this.getASNDocumentUploadList()
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

    this.dataService.ASNAttachmentdata(this.SPName, Parameter).subscribe((res) => {
      debugger
      if (res.success == true) {
        this.spinner.hide();
        let data = res.data
        console.log(data)
        this.linearray2 = data.flatMap(
          (item: { InnerData: string }) =>
            item.InnerData ? JSON.parse(item.InnerData) : []
        );

        this.innerTableDataSource = new MatTableDataSource<any>(this.linearray2)
      }
      else {
        this.spinner.hide();
        this.toastr.danger("error", res.data[0].message);
      }

    })

  }

  fileChangeEvent(fileInput: any) {
    debugger
    if (fileInput.target.files && fileInput.target.files.length > 0) {

      let Formdata = new FormData();
      const file = fileInput.target.files?.[0];
      const fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf('.');
      // Extract the base name (filename without extension)
      const baseFileName = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
      // Extract the extension and add a '.' before it if there is an extension
      const fileExtension = lastDotIndex !== -1 ? `.${fileName.slice(lastDotIndex + 1)}` : '';
      const now = new Date();
      this.formattedDateTime = this.datePipe.transform(now, 'dd/MM/yyyy HH:mm:ss');
      if (this.linearray2.length == 0) {
        this.linearray2.push({
          LineID: this.currentIndex++,
          FileName: baseFileName,
          ExtensionType: fileExtension,
          //FilePath: data.result.Path,
          Remarks: this.documentData.description,
          createdBy: this.vendor,
          DocumentType: this.documentData.documentType,
          DocumentName: this.documentData.documentName,
          ASNNo: this.documentData.ASNNo,
          Canceled: 'N',
          UploadedOn: this.formattedDateTime,
          FileObject: file
        });
      }
      else {
        this.currentIndex = this.linearray2.length + 1
        this.linearray2.push({
          LineID: this.currentIndex++,
          FileName: baseFileName,
          ExtensionType: fileExtension,
          //FilePath: data.result.Path,
          Remarks: this.documentData.description,
          createdBy: this.vendor,
          DocumentType: this.documentData.documentType,
          DocumentName: this.documentData.documentName,
          ASNNo: this.documentData.ASNNo,
          Canceled: 'N',
          UploadedOn: this.formattedDateTime,
          FileObject: file
        });
      }

      this.innerTableDataSource = new MatTableDataSource<any>(this.linearray2)
      this.documentData.documentType = ''
      this.documentData.documentName = ''
      this.documentData.description = ''
      this.documentData.attachment = ''



    } else {
      // this.toastr.error('Attached File Size Exceed The Limit...');
    }
  }

  Clear() {
    this.linearray2 = [];
    this.router.navigateByUrl('/asn/documentupload')
    //  this.getASNReportList()
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

  onSave() {
    debugger
    const formData = new FormData();
    this.linearray2.forEach((doc, index) => {
      formData.append('files', doc.FileObject);                       // file(s) as files[]
      formData.append(`documents[${index}]`, JSON.stringify(doc));    // metadata as documents[0], documents[1], ...
    });
    this.dataService.attachService(this.linearray2).subscribe({
      next: (res) => {
        console.log("Upload success:", res);
        // clear the upload input row
        this.linearray2 = [];
        this.innerTableDataSource = new MatTableDataSource<any>(this.linearray2)
        this.router.navigateByUrl('/asn/documentupload')
      },
      error: (err) => {
        console.error("Upload failed:", err);
      }
    });
  }

  DownloadFile(e: any) {
    debugger

    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    let imagestr = environment.media + e.Filepath;
    link.setAttribute("href", imagestr);
    // link.setAttribute("download",'');
    document.body.appendChild(link);
    console.log(link)
    link.click();
    link.remove();

  }

  DeleteFile(e: any) {
    debugger
    e.Canceled = 'Y'
    let filterdt1 = this.linearray2.filter(item => item.Canceled === 'N');
    this.linearray2
    this.innerTableDataSource = new MatTableDataSource<any>(filterdt1)
  }

  generateQR(element: any, colName: string) {
    // Generate QR code and store in the dynamic column
    const qrData = 'data:image/png;base64,...'; // your generated QR code
    element[colName] = qrData;
  }
}
