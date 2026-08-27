// src/actions/user.ts

'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

// Přidali jsme parametr isArchived (defaultně false)
export async function getAllUsers(isArchived: boolean = false) {
  try {
    return await prisma.user.findMany({
      where: { isArchived }, 
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true, role: true }
    })
  } catch (error) {
    console.error('Chyba při načítání uživatelů:', error)
    return []
  }
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true }
    })
  } catch (error) {
    console.error('Chyba při načítání uživatele:', error)
    return null
  }
}

export async function createUser(data: { name: string, email: string, password?: string, role: string }) {
  try {
    if (!data.password) return { success: false, error: 'Heslo je povinné pro nového uživatele.' }

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return { success: false, error: 'Uživatel s tímto e-mailem již existuje.' }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role as Role,
      }
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Chyba při vytváření uživatele.' }
  }
}

export async function updateUser(id: string, data: { name: string, email: string, password?: string, role: string }) {
  try {
    const updateData: {
      name: string;
      email: string;
      role: Role;
      password?: string;
    } = {
      name: data.name,
      email: data.email,
      role: data.role as Role, 
    }

    if (data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Chyba při úpravě uživatele.' }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.update({ 
      where: { id },
      data: { isArchived: true }
    })
    revalidatePath('/admin/users')
    revalidatePath('/admin/dispatch') 
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Chyba při archivaci uživatele.' }
  }
}

// FUNKCE: Obnovení uživatele
export async function restoreUser(id: string) {
  try {
    await prisma.user.update({ 
      where: { id },
      data: { isArchived: false }
    })
    revalidatePath('/admin/users')
    revalidatePath('/admin/dispatch') 
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Chyba při obnově uživatele.' }
  }
}

// FUNKCE: Skutečné a trvalé smazání uživatele z databáze (z Archívu)
export async function hardDeleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/admin/users')
    revalidatePath('/admin/dispatch') 
    return { success: true }
  } catch (error) {
    console.error(error)
    return { 
      success: false, 
      error: 'Nelze smazat: Pracovník je již navázán na historické zakázky a smazání by rozbilo evidenci. Musí zůstat v archivu.' 
    }
  }
}