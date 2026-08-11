import { Component } from '@angular/core';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { OhmGrid } from 'src/app/3_Super/OhmGrid';
import { environment } from 'src/environments/environment';
// C-16: migration xlsx@0.18.5 (CVE-2023-30533 + paquet déréférencé) → exceljs
import { Workbook } from 'exceljs';

@Component({
  selector: 'EtatSanitaire',
  templateUrl: './EtatSanitaire.component.html',
  styleUrls: ['./EtatSanitaire.component.scss']
})

export class EtatSanitaireComponent extends OhmGrid {

  /* #region init & loading  */

  currentPage: number = 0;
  pageSize: number = 25;
  isExporting: boolean = false;

  override loadParameters(): void {
    this.entityName = environment.entityNameYstanceLog;
    this.filters = [
      { property: 'endPointName', value: 'UpdateItemByPrimaryKey' },
      { property: 'args.entityName', value: environment.entityNameEtatSanitaire }
    ];
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  override loadData() {
    let args = {
      entityName: this.entityName,
      databaseProvider: this.databaseProvider,
      filters: this.filters,
      skipValue: this.currentPage * this.pageSize,
      takeValue: this.pageSize,
    }
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe({ next: this.onSuccessLoadData, error: YstanceHelper.onErrorResponse });
  }

  async exportHistorique(data: any[]) {
    // 1. Fetch mapping tables for names
    const laboMap = await this.fetchEntityMap(environment.entityNameLaboResponsable);
    const espece1Map = await this.fetchEntityMap(environment.entityNameEspeceCible1);
    const espece2Map = await this.fetchEntityMap(environment.entityNameEspeceCible2);

    // 2. Mapping for column names
    const columnLabels: { [key: string]: string } = {
      "Date": "Date",
      "Region": "Région",
      "Zone": "Zone",
      "title": "Point de suivi",
      "zone.idLaboResponsable": "Laboratoire responsable",
      "zone.idEspececible1": "Espèce cible 1",
      "zone.idEspececible2": "Espèce cible 2",
      "biotoxineEspece1.typeTest": "Type test biotoxine 1",
      "biotoxineEspece1.dateEchantillonnageEspece1": "Date échantillonnage biotoxine 1",
      "biotoxineEspece1.niveauAlerteBiotoxine1": "Niveau alerte biotoxine 1",
      "biotoxineEspece1.lspEspece1": "LSP biotoxine 1",
      "biotoxineEspece1.lsp1AcideOkadaique": "Acide Okadaïque 1",
      "biotoxineEspece1.lsp1AcideAzaspiracides": "Acide Azaspiracides 1",
      "biotoxineEspece1.lsp1Yessotoxines": "Yessotoxines 1",
      "biotoxineEspece1.pspEspece1": "PSP 1",
      "biotoxineEspece1.asp1": "ASP 1",
      "biotoxineEspece2.typeTest": "Type test biotoxine 2",
      "biotoxineEspece2.dateEchantillonnageEspece2": "Date échantillonnage biotoxine 2",
      "biotoxineEspece2.niveauAlerteBiotoxine2": "Niveau alerte biotoxine 2",
      "biotoxineEspece2.lspEspece2": "LSP biotoxine 2",
      "biotoxineEspece2.lsp2AcideOkadaique": "Acide Okadaïque 2",
      "biotoxineEspece2.lsp2AcideAzaspiracides": "Acide Azaspiracides 2",
      "biotoxineEspece2.lsp2Yessotoxines": "Yessotoxines 2",
      "biotoxineEspece2.pspEspece2": "PSP 2",
      "biotoxineEspece2.asp2": "ASP 2",
      "contaminantMicro.dateEchantillonnageMicro": "Date échantillonnage micro",
      "contaminantMicro.niveauAlerteEcoli": "Niveau alerte E. coli",
      "contaminantMicro.escherichiaColi": "E. coli",
      "contaminantChimique.dateEchantillonnageChimi1": "Date échantillonnage chimique 1",
      "contaminantChimique.dateEchantillonnageChimi2": "Date échantillonnage chimique 2",
      "contaminantChimique.cd": "Cd",
      "contaminantChimique.pb": "Pb",
      "contaminantChimique.hg": "Hg",
      "contaminantChimique.hap": "HAP",
      "contaminantChimique.pcb": "PCB",
      "contaminantChimique.dioxines": "Dioxines",
      "contaminantChimique.dioxinesAndPcbTypeDioxine": "Dioxines & PCB type dioxine",
      "phytoplancton.dateEchantillonnagePhytop": "Date échantillonnage phytoplancton",
      "phytoplancton.niveauAlertePhytoplancton": "Niveau alerte phytoplancton",
      "phytoplancton.especeResponsablePrealerte": "Espèce responsable pré-alerte",
      "phytoplancton.pseudoNitzschiaSpp": "Pseudo-nitzschia spp",
      "phytoplancton.dinophysisSpp": "Dinophysis spp",
      "phytoplancton.prorocentrumLima": "Prorocentrum lima",
      "phytoplancton.alexandriumSpp": "Alexandrium spp",
      "phytoplancton.protoceratiumReticulatum": "Protoceratium reticulatum",
      "phytoplancton.lingulodiniumPolyedrum": "Lingulodinium polyedrum",
      "phytoplancton.gonyaulaxSpinifera": "Gonyaulax spinifera",
      "phytoplancton.gymnodiniumCatenatum": "Gymnodinium catenatum",
      "phytoplancton.azadiniumSpinosum": "Azadinium spinosum",
      "parametreDeMilieu.dateMesureMilieu": "Date mesure milieu",
      "parametreDeMilieu.temperature": "Température",
      "parametreDeMilieu.salinite": "Salinité",
      "parametreDeMilieu.ph": "pH",
      "parametreDeMilieu.oxygeneDissous": "Oxygène dissous",
      "zone.dateStatutSanitaire": "Date statut sanitaire",
      "zone.statutSanitaire": "Statut sanitaire",
      // Ajoutez d'autres mappings si besoin
    };

    function flatten(obj: any, prefix = ''): any {
      let res: any = {};
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.assign(res, flatten(value, prefix + key + '.'));
        } else {
          res[prefix + key] = value;
        }
      }
      return res;
    }

    const columnsSet = new Set<string>([
      "Date", "Region", "Zone", 
      "zone.idLaboResponsable", "zone.idEspececible1", "zone.idEspececible2"
    ]);
    const rows: any[] = [];

    data.forEach((etatsanitaire: any) => {
      const date = new Date(etatsanitaire.dateAction).toLocaleString();
      const region = etatsanitaire.args.entityChanges.title;
      const zones = etatsanitaire.args.entityChanges.zones || [];
      zones.forEach((zone: any) => {
        const zoneTitle = zone.title;
        const zoneFields = { ...zone };
        delete zoneFields.point_suivi;

        (zone.point_suivi || []).forEach((point: any) => {
          const pointTitle = point.title;
          const flatPoint = flatten(point);

          // Replace IDs with names for the three fields
          flatPoint["zone.idLaboResponsable"] = laboMap[zone.idLaboResponsable] || zone.idLaboResponsable || "";
          flatPoint["zone.idEspececible1"] = espece1Map[zone.idEspececible1] || zone.idEspececible1 || "";
          flatPoint["zone.idEspececible2"] = espece2Map[zone.idEspececible2] || zone.idEspececible2 || "";

          // Add other zone fields
          Object.entries(zoneFields).forEach(([zKey, zVal]) => {
            if (!["idLaboResponsable", "idEspececible1", "idEspececible2"].includes(zKey)) {
              flatPoint[`zone.${zKey}`] = zVal;
              columnsSet.add(`zone.${zKey}`);
            }
          });

          const row: any = {
            "Date": date,
            "Region": region,
            "Zone": zoneTitle,
            ...flatPoint
          };
          Object.keys(row).forEach(k => columnsSet.add(k));
          rows.push(row);
        });
      });
    });

    const excludedColumns = [
      "zone.idTypeProduction",
      "zone.title",
      "contaminantChimique.idLaboResponsable"
    ];

    const columns = Array.from(columnsSet).filter(
      col => !excludedColumns.includes(col)
    );
    const columnsWithLabels = columns.map(col => columnLabels[col] || col);

    const worksheetData = [columnsWithLabels];
    rows.forEach(row => {
      worksheetData.push(columns.map(col => row[col] !== undefined ? row[col] : ""));
    });

    // Export to Excel via exceljs (remplace xlsx 0.18.5)
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("EtatSanitaireHistorique");
    worksheet.addRows(worksheetData);
    const currentDate = new Date();
    const filename = `Etat_Sanitaire_Historique_${currentDate.toISOString().slice(0, 10)}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    this.isExporting = false;
  }

loadAllDataForExport() {
  let args = {
    entityName: this.entityName,
    databaseProvider: this.databaseProvider,
    filters: this.filters
  };
  this.isExporting = true;
  this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe(
    (data: any) => {
      this.onSuccessLoadAllData(data);
    },
    (error: any) => {
      this.isExporting = false;
      YstanceHelper.onErrorResponse(error);
    }
  );
}

onSuccessLoadAllData(data: any) {
  this.exportHistorique(data);
}
  /* #endregion */

  // Helper to fetch id->name map for an entity
  async fetchEntityMap(entityName: string): Promise<{ [id: string]: string }> {
    // Replace with your actual API/service call
    return new Promise(resolve => {
      this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, {
        entityName,
        databaseProvider: this.databaseProvider,
        filters: []
      }).subscribe((data: any[]) => {
        // Try to find a name or label property
        const map: { [id: string]: string } = {};
        data.forEach(item => {
          map[item._id] = item.nom || item.name || item.title || item.label || item.designation || item.libelle || item._id;
        });
        resolve(map);
      });
    });
  }
}