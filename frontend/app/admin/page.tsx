/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DataTable } from '@/components/ui/DataTable';
import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { getAllShoes } from '../(main)/action';
import { IShoe } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { formatVND } from '@/lib/utils';
import { Button, ButtonV2 } from '@/components/ui/Button';
import { ArrowDownUp, Package, Plus, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react';
import { createShoesApi, deleteShoeApi, UpdateIsFeaturedShoes } from './action';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenuRadioGroupDemo } from '@/components/ui/DropdownMenuRadioGroup';
import { InputField } from '@/components/ui/Inputz';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);

  // fetch data
  const {
    data: allShoes = [],
    isLoading,
    // refetch,
  } = useQuery({
    queryKey: ['shoes'],
    queryFn: async () => {
      const res = await getAllShoes();
      return res.data;
    },
    enabled: !!userInfo?._id,
  });

  const queryClient = useQueryClient();
  const [toggleCreateShoes, setToggleCreateShoes] = useState(false); // toggle dialog create shoes
  const [numberColor, setNumberColor] = useState<number>(1);
  const [shoeToDelete, setShoeToDelete] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    brand: '',
    description: '',
    price: 0,
    category: '',
    gender: '',
    isFeatured: false,
    colors: [{ colorName: '', color: '', img: ['', '', '', '', ''], sizes: [] }],
  });

  // Data options
  const brandOptions = ['Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance', 'Airmax'];
  const categoryOptions = ['Training', 'Basketball', 'Football', 'Golf', 'Tennis', 'Running', 'Outdoor', 'Life style'];
  const genderOptions = ['Men', 'Women', 'Unisex'];

  // table columns
  const columns: ColumnDef<IShoe>[] = [
    {
      accessorKey: 'name',
      // header: 'Name',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Name
            <ArrowDownUp />
          </Button>
        );
      },
    },
    {
      accessorKey: 'brand',
      // header: 'Brand',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Brand
            <ArrowDownUp />
          </Button>
        );
      },
    },
    {
      accessorKey: 'price',
      // header: 'Price',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Price
            <ArrowDownUp />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('price'));
        return <div className="">{formatVND(amount)}</div>;
      },
    },
    {
      accessorKey: 'isFeatured',
      // header: 'Is Featured',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Is Featured
            <ArrowDownUp />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isFeatured = !!row.getValue('isFeatured');

        const handleToggleIsFeatured = async () => {
          const shoeId = row.original._id;

          // api update is featured shoes
          const res = await UpdateIsFeaturedShoes({
            axiosJWT,
            accessToken: userInfo?.accessToken || '',
            shoeId,
            isFeatured: !isFeatured,
          });
          if (res?.success === true) {
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
          }
        };

        return (
          <button
            onClick={() => handleToggleIsFeatured()}
            className="hover:opacity-80 transition-all flex items-center gap-2"
          >
            {isFeatured ? (
              <ToggleRight className="text-(--secondary-color) fill-yellow-500/20" size={32} />
            ) : (
              <ToggleLeft className="text-slate-400" size={32} />
            )}
          </button>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              className="bg-red-400"
              onClick={() => setShoeToDelete({ id: row.original._id, name: row.original.name })}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleNumberColorChange = (count: number) => {
    setNumberColor(count);
    setFormData((prev: any) => {
      let colors = [...prev.colors];
      while (colors.length < count) {
        colors.push({
          colorName: '',
          color: '',
          img: ['', '', '', '', ''],
          sizes: [],
        });
      }
      colors = colors.slice(0, count);
      return { ...prev, colors };
    });
  };

  const addInputSize = (colorIndex: number) => {
    setFormData((prev: any) => {
      const updatedColors = structuredClone(prev.colors);

      updatedColors[colorIndex].sizes.push({
        id: Date.now() + Math.random(),
        size: '',
        stock: '',
      });

      return { ...prev, colors: updatedColors };
    });
  };

  const removeInputSize = (colorIndex: number, sizeIndex: number) => {
    setFormData((prev: any) => {
      const colors = [...prev.colors];
      colors[colorIndex].sizes = colors[colorIndex].sizes.filter((_: any, i: number) => i !== sizeIndex);
      return { ...prev, colors };
    });
  };

  const handleSizeStockChange = (colorIndex: number, sizeIndex: number, field: 'size' | 'stock', value: string) => {
    setFormData((prev: any) => {
      const colors = [...prev.colors];
      colors[colorIndex].sizes[sizeIndex] = {
        ...colors[colorIndex].sizes[sizeIndex],
        [field]: value === '' ? '' : Number(value),
      };
      return { ...prev, colors };
    });
  };

  const handleImgUrlChange = (colorIndex: number, imgIndex: number, value: string) => {
    setFormData((prev: any) => {
      const colors = [...prev.colors];
      const updatedImgs = [...colors[colorIndex].img];
      updatedImgs[imgIndex] = value;
      colors[colorIndex].img = updatedImgs;
      return { ...prev, colors };
    });
  };

  const handleCreateShoes = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      // Gọi API create từ server actions hoặc qua axiosJWT tùy kiến trúc của bạn
      const res = await createShoesApi({ axiosJWT, accessToken: userInfo?.accessToken || '', data: formData });
      if (res?.success === true) {
        setToggleCreateShoes(false);
        queryClient.invalidateQueries({ queryKey: ['shoes'] });
        toast.success('Create shoes successfull.');
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!shoeToDelete) return;

    const targetId = shoeToDelete.id;
    const targetName = shoeToDelete.name;

    queryClient.setQueryData(['shoes'], (oldData: any) => {
      if (!oldData) return [];
      return oldData.filter((shoe: any) => shoe._id !== targetId);
    });

    await handleDeleteShoe(targetId, targetName);
    setShoeToDelete(null);
  };

  const handleDeleteShoe = async (shoeId: string, shoeName: string) => {
    if (!shoeToDelete) return;

    const res = await deleteShoeApi({
      axiosJWT,
      accessToken: userInfo?.accessToken || '',
      shoeId,
    });

    if (res?.success) {
      toast.success(`Delete successfully ${shoeName}.`);
      queryClient.invalidateQueries({ queryKey: ['shoes'] });
    } else {
      toast.success('Delete failed! Please try again.');
    }

    setShoeToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="w-full p-10 ">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={`w-full p-10 flex flex-col gap-4`}>
      <ButtonV2 className="flex flex-row items-center gap-1" onClick={() => setToggleCreateShoes(!toggleCreateShoes)}>
        <Package size={18} />
        Create shoes
      </ButtonV2>

      <DataTable columns={columns} data={allShoes} filterKey="name" />

      {/* Dialog create new shoes */}
      {toggleCreateShoes && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-60 backdrop-blur-sm transition-opacity"
            onClick={() => setToggleCreateShoes(false)}
          />

          <Card className="fixed w-[80%]  border border-slate-200 shadow-2xl z-70 bg-light top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[60vh] flex flex-col">
            {/* button close dialog */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() => setToggleCreateShoes(false)}
            >
              <X className="h-4 w-4 text-(--primary-color)" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Header Create new shoes */}
            <CardHeader>
              <CardTitle className="flex flex-row gap-1">
                <Package size={18} />
                Create new shoes
              </CardTitle>
            </CardHeader>

            {/* form data */}
            <form
              onSubmit={handleCreateShoes}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin"
            >
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <InputField
                  className="bg-slate-50/50"
                  inputName="Shoes name"
                  value={formData?.name || ''}
                  setValue={(e) => setFormData({ ...formData, name: e })}
                />
                <DropdownMenuRadioGroupDemo
                  label="Brand"
                  options={brandOptions}
                  selectedValue={formData.brand || ''}
                  onValueChange={(brand) => setFormData({ ...formData, brand })}
                />
              </div>

              <InputField
                className="bg-slate-50/50"
                inputName="Description"
                value={formData?.description || ''}
                setValue={(e) => setFormData({ ...formData, description: e })}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <InputField
                  className="bg-slate-50/50"
                  inputName="Price (VND)"
                  value={formData.price ? String(formData.price) : ''}
                  setValue={(e) => setFormData({ ...formData, price: e === '' ? 0 : Number(e) })}
                />
                <DropdownMenuRadioGroupDemo
                  label="Category"
                  options={categoryOptions}
                  selectedValue={formData.category || ''}
                  onValueChange={(category) => setFormData({ ...formData, category })}
                />
                <DropdownMenuRadioGroupDemo
                  label="Gender"
                  options={genderOptions}
                  selectedValue={formData.gender || ''}
                  onValueChange={(gender) => setFormData({ ...formData, gender })}
                />
              </div>

              {/* Is Featured Toggle */}
              <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-lg border">
                <span className="text-sm font-medium text-primary-color">Is Featured Product:</span>
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary-color"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
              </div>

              {/* Choose number of color */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary-color">Number of colors:</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((num) => (
                    <label
                      key={num}
                      className="flex items-center gap-1.5 bg-slate-50/50 px-3 py-1.5 rounded-md cursor-pointer hover:bg-slate-200"
                    >
                      <input
                        type="radio"
                        name="numberColor"
                        checked={numberColor === num}
                        onChange={() => handleNumberColorChange(num)}
                        className="accent-primary-color"
                      />
                      <span className="text-sm font-medium text-primary-color">{num}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vòng lặp Render từng Màu sắc và Size kèm theo */}
              <div className="flex flex-col gap-6">
                {formData.colors.map((colorBlock: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-50/50 border rounded-xl flex flex-col gap-4 relative">
                    <span className="absolute top-2 right-4 text-xs font-bold text-slate-400">COLOR #{index + 1}</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <InputField
                        inputName={`Color Name (e.g., White Black)`}
                        value={colorBlock.colorName}
                        setValue={(val) => {
                          const updated = [...formData.colors];
                          updated[index].colorName = val;
                          setFormData({ ...formData, colors: updated });
                        }}
                      />
                      <InputField
                        inputName={`Color Hex Code (e.g., #ffffff)`}
                        value={colorBlock.color}
                        setValue={(val) => {
                          const updated = [...formData.colors];
                          updated[index].color = val;
                          setFormData({ ...formData, colors: updated });
                        }}
                      />
                    </div>

                    {/* Nhập URL hình ảnh cho màu này */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-slate-600">Images URL (Up to 5 images):</span>
                      <div className="grid grid-cols-1 gap-2">
                        {colorBlock.img.map((imgUrl: string, imgIdx: number) => (
                          <InputField
                            key={imgIdx}
                            placeholder={`URL Image ${imgIdx + 1}`}
                            value={imgUrl}
                            setValue={(e) => handleImgUrlChange(index, imgIdx, e)}
                            className="w-full text-xs px-3 py-2 border rounded pr-8 text-gray-400 focus:text-primary-color"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quản lý Size và Stock cho từng màu */}
                    <div className="flex flex-col gap-3 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">Sizes & Stock management:</span>
                        <Button
                          type="button"
                          onClick={() => addInputSize(index)}
                          size="sm"
                          className="h-7 text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 flex items-center gap-1"
                        >
                          <Plus size={12} /> Add size
                        </Button>
                      </div>

                      {colorBlock.sizes.map((sizeItem: any, sizeIdx: number) => (
                        <div
                          key={sizeItem.id}
                          className="flex gap-2 items-center p-2 rounded-lg animate-in fade-in duration-200 grid-cols-2"
                        >
                          <InputField
                            type="number"
                            placeholder="Size (e.g. 42)"
                            value={sizeItem.size}
                            onChange={(e) => handleSizeStockChange(index, sizeIdx, 'size', e.target.value)}
                          />
                          <InputField
                            type="number"
                            placeholder="Stock Quantity"
                            value={sizeItem.stock}
                            onChange={(e) => handleSizeStockChange(index, sizeIdx, 'stock', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInputSize(index, sizeIdx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 shrink-0"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <ButtonV2 className="w-full hover:scale-[1.01] transition-transform py-3 text-base" type="submit">
                  Create Shoes Product
                </ButtonV2>
              </div>
            </form>
          </Card>
        </>
      )}

      {shoeToDelete && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-60 backdrop-blur-sm transition-opacity"
            onClick={() => setShoeToDelete(null)}
          />

          <Card className="fixed w-[90%] max-w-105 bg-white border border-slate-200 shadow-2xl z-70 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 flex flex-col gap-4 rounded-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="text-red-500" size={20} />
                Delete Item
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-800">{shoeToDelete.name}</span>?
              </p>
            </div>

            {/* Button Cancel, Confirm */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => setShoeToDelete(null)} // Bấm hủy thì đóng dialog
                className="px-4 h-9 text-sm font-medium border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDelete} // Bấm nút này mới chạy logic filter UI cũ của bạn
                className="px-4 h-9 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
              >
                Confirm Delete
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export const Textz = (props: any) => {
  const { className, ...prop } = props;
  return (
    <span className={`${className} text-md text-(--primary-blue`} {...prop}>
      {props.children}
    </span>
  );
};
