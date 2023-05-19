import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrar-usuarios',
  templateUrl: './administrar-usuarios.component.html',
  styleUrls: ['./administrar-usuarios.component.scss']
})
export class AdministrarUsuariosComponent implements OnInit {
  single = [
    {
      "name": "Menú Principal",
      "value": 64
    },
    {
      "name": "Mis Marcaciones",
      "value": 39
    },
    {
      "name": "Cronograma de Pagos",
      "value": 29
    }
  ];
  diasVisita = [{"name": 9, "value": 5},
                {"name": 10, "value": 6},
                {"name": 11, "value": 7},
                {"name": 12, "value": 6},
                {"name": 13, "value": 23},
                {"name": 14, "value": 16},
                {"name": 15, "value": 17},
                {"name": 16, "value": 5},
                {"name": 17, "value": 5},
                {"name": 18, "value": 6},
                {"name": 19, "value": 12},
                {"name": 20, "value": 14},
                {"name": 21, "value": 13},
                {"name": 22, "value": 15},
                {"name": 23, "value": 27},
               ];
  diasVisitaYLabel = "Visitas a la página";
  edades = [{"name": "[20 - 30]","value": 9},{"name": "[30 - 40]","value": 9},{"name": "[40 - 50]","value": 14},{"name": "[50 - 60]","value": 20}
  ];
  view = [350, 200];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Páginas';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Visitas';

  pieTitleLegend = "Edades";
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  colorScheme2 = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  colorScheme3 = {
    domain: ['#023858', '#045a8d', '#0570b0', '#3690c0']
  };

  schemeType: string = 'linear';

  constructor() {
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  ngOnInit(): void {
  }

}
