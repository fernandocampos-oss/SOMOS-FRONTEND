export interface DjConflicto {
    idDjConflictoInteres            : number;
    dgIndVinculoLaboralContractual  : boolean;
    dgIndCasoConflicto              : boolean;
    dgTipo                          : string;
    dgCodPlanilla                   : string;
    dgNombresApellidos              : string;
    dgRedidred                      : number;
    dgNombreRed                     : string;
    dgArea                          : string;
    dgIpressidipress                : number;
    dgNombreIpress                  : string;
    dgCargo                         : string;
    dgIndAutenticos                 : string;    
    dbjIndVinculo                   : string;
    dbjIndVinculoDet                : string;
    dgjIndConyuge                   : string;
    dgjIndConyugeDet                : string;
    vfaIndParientes                 : string;
    vfaIndParientesDet              : string;
    dveIndPropietario               : string;
    dveIndPropietarioDet            : string;
    osIndOtrasSituaciones           : string;
    osIndOtrasSituacionesDet        : string;
    numeroDni                       : string;
    fechaCreacion                   : Date;
  }