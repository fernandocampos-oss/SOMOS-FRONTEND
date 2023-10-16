export class MenuPublicacion {
    id: number;
    nom_largo: string;
    nom_corto: string;
    fechaPub: string;
    imgRuta: string;
    redireccion?: string;  
}

export class PublicacionRequest{
    titulo: string;
    descripcion: string;
    imagenBase64: string;
    urlRedireccion: string;
    alcance: number;
    anuncio: boolean;
    votacion: boolean;
    redes: string[];
}

export class PublicacionResponse{
    idPublicacion: number;
    titulo: string;
    descripcion: string;
    imagenBase64: string;
    urlRedireccion: string;
    fechaCreacion: Date;
    votoActivo: boolean;
}