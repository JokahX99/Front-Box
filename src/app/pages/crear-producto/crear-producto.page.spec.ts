import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearProductoPage } from './crear-producto.page';

describe('CrearProductoPage', () => {
  let component: CrearProductoPage;
  let fixture: ComponentFixture<CrearProductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
